import 'server-only'

import type { EDITION_BY_YEAR_QUERY_RESULT } from '@/../sanity.types'
import type {
  CarouselImage,
  CarouselLayout,
  CarouselSlide,
  CreditEntry,
  Edition,
  ImageData,
  ProgramBlock,
  ProgramBlockFormat,
  ProgramBlockType,
  ProgramData,
  ProgramFilm,
} from '@/types/edition'
import { urlFor } from './image'
import { type DynamicFetchOptions, sanityFetch } from './live'
import { EDITION_BY_YEAR_QUERY, EDITION_YEARS_QUERY, EDITIONS_LIST_QUERY } from './queries'

export interface EditionListItem {
  year: number
  theme: string
  status: 'upcoming' | 'published'
}

type SanityEdition = NonNullable<EDITION_BY_YEAR_QUERY_RESULT>

interface SanityImage {
  asset?: unknown
  alt?: string | null
}

const SLIDE_LAYOUTS: Record<string, CarouselLayout> = {
  slideFull: 'full',
  slideDuo: 'duo',
  slideFeaturedPortrait: 'featured-portrait',
  slideTrio: 'trio',
  slideFeaturedStack: 'featured-stack',
}

function toImageData(field: SanityImage | null | undefined): ImageData | undefined {
  if (!field?.asset) return undefined
  return { src: urlFor(field).url(), alt: field.alt ?? '' }
}

function requireImageData(field: SanityImage | null | undefined, label: string): ImageData {
  const data = toImageData(field)
  if (!data) throw new Error(`Missing asset on ${label}`)
  return data
}

function mapCarouselImage(item: { caption: string; image: SanityImage }): CarouselImage {
  return { image: requireImageData(item.image, 'carousel image'), caption: item.caption }
}

function mapCarousel(slides: SanityEdition['carousel']): CarouselSlide[] | undefined {
  if (!slides?.length) return undefined
  const out: CarouselSlide[] = []
  for (const slide of slides) {
    const layout = SLIDE_LAYOUTS[slide._type]
    if (!layout) continue
    const images = slide.images.map(mapCarouselImage)
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
      out.push({ type: row.type, label: row.label, value: row.value })
    }
  }
  return out
}

function mapEdition(raw: SanityEdition): Edition {
  const thumb = toImageData(raw.thumbImage)
  const carousel = mapCarousel(raw.carousel)
  return {
    year: raw.year,
    title: raw.title,
    theme: raw.theme,
    themeHighlight: raw.themeHighlight,
    dateTape: raw.dateTape,
    heroImage: requireImageData(raw.heroImage, 'heroImage'),
    ...(thumb ? { thumbImage: thumb } : {}),
    manifesto: raw.manifesto,
    themeSection: raw.themeSection,
    artists: raw.artists,
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
  const { data: raw } = await sanityFetch({
    query: EDITION_BY_YEAR_QUERY,
    params: { year },
    perspective: options.perspective,
    stega: options.stega,
  })
  return raw ? mapEdition(raw) : undefined
}

/**
 * Cached list of edition years. Drafts never introduce or remove a year
 * (year is set on creation and rarely changes), so we hardcode published
 * here. Used by /editions, /artists, sitemap, generateStaticParams.
 */
export async function getEditionYearsFromSanity(): Promise<number[]> {
  'use cache'
  const { data } = await sanityFetch({
    query: EDITION_YEARS_QUERY,
    perspective: 'published',
    stega: false,
  })
  return data ?? []
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
  const { data } = await sanityFetch({
    query: EDITIONS_LIST_QUERY,
    perspective: options.perspective,
    stega: options.stega,
  })
  return (data ?? []).flatMap((entry) => {
    if (!entry.year || !entry.theme) return []
    return [
      {
        year: entry.year,
        theme: entry.theme,
        status: entry.status === 'upcoming' ? 'upcoming' : 'published',
      },
    ]
  })
}
