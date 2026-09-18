import type {
  EDITION_BY_YEAR_QUERY_RESULT,
  EDITION_SUMMARIES_QUERY_RESULT,
} from '@/../sanity.types'
import { definedFields } from '@/lib/defined-fields'
import { composeDateLine, composeDateRange, composeDateSpan, dayToken } from '@/lib/edition-dates'
import { editionHref } from '@/lib/edition-href'
import { slugify } from '@/lib/slugify'
import { rollUpVenue } from '@/lib/venues'
import { mapCarousel } from '@/sanity/lib/carousel'
import { requireImageData, type SanityImageField, toImageData } from '@/sanity/lib/image'
import type {
  CalendarEvent,
  Edition,
  EditionCredits,
  EditionFact,
  EditionSummary,
  MarkedPartner,
  PartnerMark,
  TeamCredit,
} from '@/types/edition'

export type SanityEdition = NonNullable<EDITION_BY_YEAR_QUERY_RESULT>

// Words of the event name kept in an auto-derived slug — enough to disambiguate
// while staying short ("opening-of-the-main-exhibition" → first five).
const SLUG_NAME_WORDS = 5

// `d-MMM` lowercased from an ISO date: "2025-09-12" → "12-sep".
function dateSlugPart(iso: string): string {
  const token = dayToken(iso)
  return token ? `${token.day}-${token.month.toLowerCase()}` : slugify(iso)
}

// The minimal shape slug derivation needs from a raw event.
export interface EventSlugInput {
  slug?: string | null
  name: string
  startDate: string
  venue: { slug?: string | null; name: string }
}

// The auto-derived event slug — date · venue · shortened name (ADR 0015). Uses
// the venue's own `slug` (e.g. "cfp") when set, else its slugified name.
function deriveEventSlug(e: EventSlugInput): string {
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

/**
 * Every event's final slug, in order — editor override (slugified) first,
 * else the auto-derived one, deduped across the edition. The one
 * implementation of ADR 0015's slug rule: `mapEvents` stamps its output onto
 * the mapped events, and everything downstream (routes, static params,
 * `findEvent`) reads the stamped slug rather than re-deriving.
 */
export function deriveEventSlugs(events: EventSlugInput[]): string[] {
  return uniqueEventSlugs(events.map((e) => (e.slug ? slugify(e.slug) : deriveEventSlug(e))))
}

export function mapEvents(raw: SanityEdition['events']): CalendarEvent[] {
  if (!raw?.length) return []
  const slugs = deriveEventSlugs(raw)
  return raw.map((e, i) =>
    definedFields({
      key: e._key,
      slug: slugs[i]!,
      name: e.name,
      startDate: e.startDate,
      startTime: e.startTime,
      endDate: e.endDate,
      types: e.types.map((t) => ({ title: t.title, slug: t.slug })),
      venue: definedFields({
        name: e.venue.name,
        address: e.venue.address,
        partOf: e.venue.partOf ? { name: e.venue.partOf.name } : undefined,
        rollUp: rollUpVenue(e.venue),
      }),
      description: e.description,
      image: toImageData(e.image),
      ogImage: toImageData(e.ogImage),
      facebookUrl: e.facebookUrl,
      ticketUrl: e.ticketUrl,
      featured: e.featured ?? false,
    }),
  )
}

const MIN_MARK_SCALE = 0.35
const MAX_MARK_SCALE = 1
const LEAD_MARK_BOOST = 1.4
const MAX_LEAD_MARK_SCALE = 1.15

interface SanityLogo extends SanityImageField {
  dimensions?: { width: number; height: number; aspectRatio: number } | null
}

function markScale(aspectRatio: number, lead: boolean): number {
  const equalArea = aspectRatio > 0 ? 1 / Math.sqrt(aspectRatio) : MAX_MARK_SCALE
  const fitted = Math.min(Math.max(equalArea, MIN_MARK_SCALE), MAX_MARK_SCALE)
  const scaled = lead ? Math.min(fitted * LEAD_MARK_BOOST, MAX_LEAD_MARK_SCALE) : fitted
  return Math.round(scaled * 100) / 100
}

function toPartnerMark(
  logo: SanityLogo | null | undefined,
  lead: boolean,
): PartnerMark | undefined {
  const image = toImageData(logo)
  const dimensions = logo?.dimensions
  if (!image || !dimensions) return undefined
  const { width, height, aspectRatio } = dimensions
  return { ...image, width, height, scale: markScale(aspectRatio, lead) }
}

interface SanityOrg {
  name: string
  url?: string | null
  kind?: string | null
  logo?: SanityLogo | null
}

function markedPartner(org: SanityOrg, lead: boolean): MarkedPartner | undefined {
  if (org.kind === 'gallery') return undefined
  const mark = toPartnerMark(org.logo, lead)
  return mark ? definedFields({ name: org.name, mark, url: org.url }) : undefined
}

function uniqueBy<T>(items: T[], key: (item: T) => string): T[] {
  const seen = new Set<string>()
  return items.filter((item) => {
    const id = key(item)
    if (seen.has(id)) return false
    seen.add(id)
    return true
  })
}

type SanityOrgRow = Exclude<NonNullable<SanityEdition['credits']>[number], { _type: 'creditText' }>

function rowOrgs(row: SanityOrgRow): SanityOrg[] {
  if (row._type === 'creditOrgList') return row.organizations
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- a dereferenced reference is null when it dangles (unpublished/deleted org); TypeGen types the deref non-null
  return row.organization ? [row.organization] : []
}

// `type` is the block a row belongs to: `partner` is credited by logo, falling
// back to the name list; `primary` adds a team credit line and so is never
// listed by name twice; `secondary` is the team block alone, which is what
// keeps the aegis row's logo out of the wall.
export function mapCredits(rows: SanityEdition['credits']): EditionCredits {
  const marks: MarkedPartner[] = []
  const named: string[] = []
  const teamOrgs: TeamCredit[] = []
  const teamNames: TeamCredit[] = []

  for (const row of rows ?? []) {
    if (row._type === 'creditText') {
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- a cleared entry in a primitive array is null at runtime; TypeGen types the elements non-null
      const names = row.names?.filter((n): n is string => Boolean(n?.trim())) ?? []
      if (row.type !== 'partner') teamNames.push({ kind: 'names', label: row.label, names })
      continue
    }

    const lead = row.lead ?? false
    const orgs = rowOrgs(row)
    if (orgs.length === 0) continue

    if (row.type !== 'secondary') {
      for (const org of orgs) {
        const marked = markedPartner(org, lead)
        if (marked) marks.push(marked)
        else if (row.type === 'partner') named.push(org.name)
      }
    }
    if (row.type !== 'partner') {
      teamOrgs.push(
        row._type === 'creditOrg'
          ? definedFields({
              kind: 'org' as const,
              label: row.label,
              name: row.organization.name,
              detail: row.detail,
            })
          : { kind: 'names', label: row.label, names: orgs.map((org) => org.name) },
      )
    }
  }

  return {
    marks: uniqueBy(marks, (m) => m.mark.src),
    named: uniqueBy(named, (n) => n),
    teamOrgs,
    teamNames,
  }
}

export function editionFacts({
  dates,
  venue,
  artistCount,
  eventCount,
}: {
  dates: string
  venue: string
  artistCount: number
  eventCount: number
}): EditionFact[] {
  const facts: EditionFact[] = []
  if (dates) facts.push({ kind: 'dates', text: dates })
  if (venue) facts.push({ kind: 'venue', text: venue })
  if (artistCount > 0) facts.push({ kind: 'artists', count: artistCount })
  if (eventCount > 0) facts.push({ kind: 'events', count: eventCount })
  return facts
}

export function mapEditionSummary(raw: EDITION_SUMMARIES_QUERY_RESULT[number]): EditionSummary {
  return definedFields({
    year: raw.year,
    theme: raw.theme,
    themeHighlight: raw.themeHighlight ?? '',
    themeBody: raw.themeBody ?? '',
    status: raw.status === 'live' ? ('live' as const) : ('announced' as const),
    href: editionHref(raw.year),
    dateStart: raw.dateStart ?? undefined,
    dateLine: composeDateLine(raw),
    facts: editionFacts({
      dates: composeDateSpan(raw),
      venue: raw.hasProgram === false ? (raw.venueLine ?? '') : '',
      artistCount: raw.artistCount ?? 0,
      eventCount: raw.eventCount ?? 0,
    }),
    heroImage: toImageData(raw.heroImage),
    thumbImage: toImageData(raw.thumbImage),
  })
}

// Fields below are marked nullable by TypeGen because the schema makes
// them optional for `upcoming` editions, but EDITION_BY_YEAR_QUERY only
// returns `published` editions where Sanity's conditional validation has
// enforced them as required. The empty-string / empty-array fallbacks
// are belt-and-suspenders for an unexpected dataset shape.
export function mapEdition(raw: SanityEdition): Edition {
  const dateRange = composeDateRange(raw)
  const artists = raw.artists ?? []
  const events = mapEvents(raw.events)
  return definedFields({
    year: raw.year,
    theme: raw.theme,
    themeHighlight: raw.themeHighlight ?? '',
    themeGloss: raw.themeGloss || undefined,
    dateRange,
    dateLine: composeDateLine(raw),
    dateStart: raw.dateStart ?? '',
    dateEnd: raw.dateEnd ?? '',
    venueLine: raw.venueLine ?? '',
    heroImage: requireImageData(raw.heroImage, 'heroImage'),
    thumbImage: toImageData(raw.thumbImage),
    ogImage: toImageData(raw.ogImage),
    metaDescription: raw.metaDescription,
    manifesto: {
      title: raw.manifesto?.title ?? '',
      highlight: raw.manifesto?.highlight ?? '',
      body: raw.manifesto?.body ?? '',
    },
    // Older docs predate the field; a missing value means "has a program" (ADR 0018).
    hasProgram: raw.hasProgram ?? true,
    artists,
    events,
    carousel: mapCarousel(raw.carousel),
    credits: mapCredits(raw.credits),
    facts: editionFacts({
      dates: dateRange,
      venue: raw.venueLine ?? '',
      artistCount: artists.length,
      eventCount: events.length,
    }),
  })
}
