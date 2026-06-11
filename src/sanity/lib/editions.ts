import 'server-only'

import type { EDITION_BY_YEAR_QUERY_RESULT } from '@/../sanity.types'
import type { EditionLead } from '@/lib/derive-editions'
import { composeDateTape, dayToken } from '@/lib/edition-dates'
import { slugify } from '@/lib/slugify'
import type { CalendarEvent, CreditEntry, Edition } from '@/types/edition'
import { mapCarousel } from './carousel'
import { requireImageData, toImageData } from './image'
import { type DynamicFetchOptions, queryData } from './live'
import {
  EDITION_BY_YEAR_QUERY,
  EDITION_YEARS_QUERY,
  EDITIONS_LIST_QUERY,
  HERO_EDITION_QUERY,
  SITEMAP_QUERY,
  VISIT_EDITION_QUERY,
} from './queries'

export interface EditionListItem {
  year: number
  theme: string
  status: 'upcoming' | 'live'
  /** ISO `YYYY-MM-DD` edition start, when set — lets the latest/upcoming
   *  derivation (ADR 0016) place this edition. Absent for the online 2021. */
  dateStart?: string
}

type SanityEdition = NonNullable<EDITION_BY_YEAR_QUERY_RESULT>

type SanityEvent = NonNullable<SanityEdition['events']>[number]

// Words of the event name kept in an auto-derived slug — enough to disambiguate
// while staying short ("opening-of-the-main-exhibition" → first five).
const SLUG_NAME_WORDS = 5

// `d-MMM` lowercased from an ISO date: "2025-09-12" → "12-sep".
function dateSlugPart(iso: string): string {
  const token = dayToken(iso)
  return token ? `${token.day}-${token.month.toLowerCase()}` : slugify(iso)
}

// The auto-derived event slug — date · venue · shortened name (ADR 0015). Uses
// the venue's own `slug` (e.g. "cfp") when set, else its slugified name.
function deriveEventSlug(e: SanityEvent): string {
  const venuePart = slugify(e.venue.slug ?? e.venue.name)
  const namePart = slugify(e.name).split('-').filter(Boolean).slice(0, SLUG_NAME_WORDS).join('-')
  return [dateSlugPart(e.startDate), venuePart, namePart].filter(Boolean).join('-')
}

// Make every slug unique within the edition so a path-keyed route resolves to
// exactly one event: append -2/-3… on collision (an editor's override is taken
// as-is first, the counter is the deterministic tiebreaker).
function uniqueEventSlugs(bases: string[]): string[] {
  const used = new Set<string>()
  return bases.map((base) => {
    let candidate = base || 'event'
    let n = 2
    while (used.has(candidate)) candidate = `${base || 'event'}-${n++}`
    used.add(candidate)
    return candidate
  })
}

// The three mappers below are exported for the co-located unit tests (an
// internal seam); pages always go through the cached fetchers.
export function mapEvents(raw: SanityEdition['events']): CalendarEvent[] | undefined {
  if (!raw?.length) return undefined
  const slugs = uniqueEventSlugs(raw.map((e) => (e.slug ? slugify(e.slug) : deriveEventSlug(e))))
  return raw.map((e, i) => {
    const image = toImageData(e.image)
    const ogImage = toImageData(e.ogImage)
    return {
      key: e._key,
      slug: slugs[i]!,
      name: e.name,
      startDate: e.startDate,
      ...(e.startTime ? { startTime: e.startTime } : {}),
      ...(e.endDate ? { endDate: e.endDate } : {}),
      types: e.types.map((t) => ({ title: t.title, slug: t.slug })),
      venue: {
        name: e.venue.name,
        type: e.venue.type,
        ...(e.venue.address ? { address: e.venue.address } : {}),
        ...(e.venue.mapUrl ? { mapUrl: e.venue.mapUrl } : {}),
        ...(e.venue.partOf
          ? { partOf: { name: e.venue.partOf.name, type: e.venue.partOf.type } }
          : {}),
      },
      description: e.description,
      ...(image ? { image } : {}),
      ...(ogImage ? { ogImage } : {}),
      ...(e.facebookUrl ? { facebookUrl: e.facebookUrl } : {}),
      ...(e.ticketUrl ? { ticketUrl: e.ticketUrl } : {}),
      featured: e.featured ?? false,
    }
  })
}

export function mapCredits(rows: SanityEdition['credits']): CreditEntry[] {
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
export function mapEdition(raw: SanityEdition): Edition {
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
    ...(() => {
      const events = mapEvents(raw.events)
      return events ? { events } : {}
    })(),
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
 * The Visit page's edition switch (siteSettings.visitEdition) — 'latest' or
 * 'upcoming', defaulting to 'latest' when unset. Resolved against the derived
 * editions by `getVisitEdition` (ADR 0016). Respects the caller's perspective so
 * the Studio can preview a draft switch.
 */
export async function getVisitEditionLeadFromSanity(
  options: DynamicFetchOptions,
): Promise<EditionLead> {
  'use cache'
  return (await queryData(VISIT_EDITION_QUERY, options)) === 'upcoming' ? 'upcoming' : 'latest'
}

/**
 * The home-hero edition switch (siteSettings.heroEdition) — 'latest' or
 * 'upcoming', defaulting to 'latest' when unset. Resolved against the derived
 * editions by `getHeroUpcoming` (ADR 0016). Respects the caller's perspective so
 * the Studio can preview a draft switch.
 */
export async function getHeroEditionLeadFromSanity(
  options: DynamicFetchOptions,
): Promise<EditionLead> {
  'use cache'
  return (await queryData(HERO_EDITION_QUERY, options)) === 'upcoming' ? 'upcoming' : 'latest'
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
        ...(entry.dateStart ? { dateStart: entry.dateStart } : {}),
      },
    ]
  })
}
