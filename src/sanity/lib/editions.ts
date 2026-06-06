import 'server-only'

import type { EDITION_BY_YEAR_QUERY_RESULT } from '@/../sanity.types'
import { composeDateTape } from '@/lib/edition-dates'
import type {
  CarouselImage,
  CarouselLayout,
  CarouselSlide,
  CreditEntry,
  Edition,
  ProgramBlock,
  ProgramBlockFormat,
  ProgramBlockType,
  ProgramData,
  ProgramFilm,
} from '@/types/edition'
import { requireImageData, type SanityImageField, toImageData } from './image'
import { type DynamicFetchOptions, queryData } from './live'
import {
  EDITION_BY_YEAR_QUERY,
  EDITION_YEARS_QUERY,
  EDITIONS_LIST_QUERY,
  SITEMAP_QUERY,
} from './queries'

export interface EditionListItem {
  year: number
  theme: string
  status: 'upcoming' | 'live'
}

type SanityEdition = NonNullable<EDITION_BY_YEAR_QUERY_RESULT>

const LAYOUT_VALUES: readonly CarouselLayout[] = [
  'full',
  'duo',
  'featured-portrait',
  'trio',
  'featured-stack',
]

function asLayout(value: string | null | undefined): CarouselLayout | undefined {
  return value && (LAYOUT_VALUES as readonly string[]).includes(value)
    ? (value as CarouselLayout)
    : undefined
}

function mapCarouselImage(item: { caption: string; image: SanityImageField }): CarouselImage {
  return { image: requireImageData(item.image, 'carousel image'), caption: item.caption }
}

function mapCarousel(slides: SanityEdition['carousel']): CarouselSlide[] | undefined {
  if (!slides?.length) return undefined
  const out: CarouselSlide[] = []
  for (const slide of slides) {
    const layout = asLayout(slide.layout)
    if (!layout) continue
    const images = (slide.images ?? []).map(mapCarouselImage)
    if (layout === 'full' && images.length === 1) {
      out.push({ layout, images: [images[0]!] })
    } else if ((layout === 'duo' || layout === 'featured-portrait') && images.length === 2) {
      out.push({ layout, images: [images[0]!, images[1]!] })
    } else if ((layout === 'trio' || layout === 'featured-stack') && images.length === 3) {
      out.push({ layout, images: [images[0]!, images[1]!, images[2]!] })
    }
  }
  return out.length ? out : undefined
}

function mapProgram(raw: NonNullable<SanityEdition['program']>): ProgramData {
  const blocks: ProgramBlock[] = raw.blocks.map((b) => ({
    type: b.type as ProgramBlockType,
    title: b.title,
    dates: b.dates,
    description: b.description,
    column: b.column as 1 | 2,
    ...(b.location ? { location: b.location } : {}),
    ...(b.format ? { format: b.format as ProgramBlockFormat } : {}),
  }))
  const films: ProgramFilm[] | undefined = raw.films?.map((f) => ({
    date: f.date,
    title: f.title,
    ...(f.note ? { note: f.note } : {}),
  }))
  return {
    dates: raw.dates,
    blocks,
    ...(films?.length ? { films } : {}),
    sftfBanner: {
      tag: raw.sftfBanner.tag,
      title: raw.sftfBanner.title,
      description: raw.sftfBanner.description,
    },
  }
}

function mapCredits(rows: SanityEdition['credits']): CreditEntry[] {
  const out: CreditEntry[] = []
  if (!rows) return out
  for (const row of rows) {
    if (row._type === 'creditOrg' && row.organization) {
      const org = row.organization
      const logo = toImageData(org.logo)
      const base = {
        type: row.type,
        label: row.label,
        value: org.name,
        ...(row.detail ? { detail: row.detail } : {}),
      }
      out.push(logo ? { ...base, logo: logo.src, logoAlt: logo.alt } : { ...base })
    } else if (row._type === 'creditOrgList' && row.organizations) {
      out.push({
        type: row.type,
        label: row.label,
        value: row.organizations.map((o) => o.name).join('\n'),
      })
    } else if (row._type === 'creditText') {
      const names = row.names?.filter((n): n is string => Boolean(n?.trim())) ?? []
      out.push({ type: row.type, label: row.label, value: names.join('\n') })
    }
  }
  return out
}

// Fields below are marked nullable by TypeGen because the schema makes
// them optional for `upcoming` editions, but EDITION_BY_YEAR_QUERY only
// returns `published` editions where Sanity's conditional validation has
// enforced them as required. The empty-string / empty-array fallbacks
// are belt-and-suspenders for an unexpected dataset shape.
function mapEdition(raw: SanityEdition): Edition {
  const thumb = toImageData(raw.thumbImage)
  const ogImage = toImageData(raw.ogImage)
  const carousel = mapCarousel(raw.carousel)
  return {
    year: raw.year,
    title: raw.title ?? '',
    theme: raw.theme,
    themeHighlight: raw.themeHighlight ?? '',
    dateTape: composeDateTape(raw),
    dateStart: raw.dateStart ?? '',
    dateEnd: raw.dateEnd ?? '',
    venueLine: raw.venueLine ?? '',
    heroImage: requireImageData(raw.heroImage, 'heroImage'),
    ...(thumb ? { thumbImage: thumb } : {}),
    ...(ogImage ? { ogImage } : {}),
    ...(raw.metaDescription ? { metaDescription: raw.metaDescription } : {}),
    manifesto: {
      title: raw.manifesto?.title ?? '',
      highlight: raw.manifesto?.highlight ?? '',
      body: raw.manifesto?.body ?? '',
    },
    themeSection: { body: raw.themeSection?.body ?? '' },
    artists: raw.artists ?? [],
    venues: raw.venues?.map(({ _key, ...rest }) => rest) ?? [],
    ...(raw.program ? { program: mapProgram(raw.program) } : {}),
    ...(carousel ? { carousel } : {}),
    credits: mapCredits(raw.credits),
  }
}

/**
 * Cached fetch of a single edition. Caller must pass perspective + stega
 * (resolved via `getDynamicFetchOptions` outside the cache boundary).
 * Mapped through `mapEdition` so the runtime shape stays stable.
 */
export async function getEditionFromSanity(
  year: number,
  options: DynamicFetchOptions,
): Promise<Edition | undefined> {
  'use cache'
  const raw = await queryData(EDITION_BY_YEAR_QUERY, options, { year })
  return raw ? mapEdition(raw) : undefined
}

/**
 * Cached list of edition years. Drafts never introduce or remove a year
 * (year is set on creation and rarely changes), so we hardcode published
 * here. Used by /editions, /artists, sitemap, generateStaticParams.
 */
export async function getEditionYearsFromSanity(): Promise<number[]> {
  'use cache'
  return (await queryData(EDITION_YEARS_QUERY, { perspective: 'published', stega: false })) ?? []
}

/**
 * Update timestamps for the sitemap, in one query. Published-only and
 * stega-free — the sitemap never previews drafts.
 */
export async function getSitemapMetadataFromSanity() {
  'use cache'
  return queryData(SITEMAP_QUERY, { perspective: 'published', stega: false })
}

/**
 * Lightweight edition list for the homepage cards. Returns just
 * `{ year, theme, status }` per edition. Editor may want to preview an
 * upcoming-edition draft on the homepage, so this respects the
 * perspective the caller resolved.
 */
export async function getEditionsListFromSanity(
  options: DynamicFetchOptions,
): Promise<EditionListItem[]> {
  'use cache'
  const data = await queryData(EDITIONS_LIST_QUERY, options)
  return (data ?? []).flatMap((entry) => {
    if (!entry.year || !entry.theme) return []
    return [
      {
        year: entry.year,
        theme: entry.theme,
        status: entry.status === 'upcoming' ? 'upcoming' : 'live',
      },
    ]
  })
}
