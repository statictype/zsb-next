import type { EDITION_BY_YEAR_QUERY_RESULT, EDITION_CARDS_QUERY_RESULT } from '@/../sanity.types'
import type { EditionCardData } from '@/components/EditionCard/EditionCard'
import { definedFields } from '@/lib/defined-fields'
import { composeDateTape, dayToken } from '@/lib/edition-dates'
import { editionHref } from '@/lib/edition-href'
import { slugify } from '@/lib/slugify'
import { rollUpVenue } from '@/lib/venues'
import { mapCarousel } from '@/sanity/lib/carousel'
import { requireImageData, toImageData } from '@/sanity/lib/image'
import type { CalendarEvent, CreditEntry, Edition } from '@/types/edition'

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

export function mapEvents(raw: SanityEdition['events']): CalendarEvent[] | undefined {
  if (!raw?.length) return undefined
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
        type: e.venue.type,
        address: e.venue.address,
        mapUrl: e.venue.mapUrl,
        partOf: e.venue.partOf
          ? { name: e.venue.partOf.name, type: e.venue.partOf.type }
          : undefined,
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

export function mapCredits(rows: SanityEdition['credits']): CreditEntry[] {
  const out: CreditEntry[] = []
  if (!rows) return out
  for (const row of rows) {
    if (row._type === 'creditOrg' && row.organization) {
      const org = row.organization
      const logo = toImageData(org.logo)
      const base = definedFields({
        type: row.type,
        label: row.label,
        value: org.name,
        detail: row.detail,
      })
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

/**
 * The /editions archive card slice — same field conventions as `mapEdition`
 * below (required hero fails loudly, optional thumb flows as absence, the
 * mapper owns the dateTape composition).
 */
export function mapEditionCard(raw: EDITION_CARDS_QUERY_RESULT[number]): EditionCardData {
  return definedFields({
    year: raw.year,
    href: editionHref(raw.year),
    theme: raw.theme,
    themeHighlight: raw.themeHighlight ?? '',
    dateTape: composeDateTape(raw),
    venueLine: raw.venueLine ?? '',
    heroImage: requireImageData(raw.heroImage, 'heroImage'),
    thumbImage: toImageData(raw.thumbImage),
  })
}

// Fields below are marked nullable by TypeGen because the schema makes
// them optional for `upcoming` editions, but EDITION_BY_YEAR_QUERY only
// returns `published` editions where Sanity's conditional validation has
// enforced them as required. The empty-string / empty-array fallbacks
// are belt-and-suspenders for an unexpected dataset shape.
export function mapEdition(raw: SanityEdition): Edition {
  return definedFields({
    year: raw.year,
    title: raw.title ?? '',
    theme: raw.theme,
    themeHighlight: raw.themeHighlight ?? '',
    dateTape: composeDateTape(raw),
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
    themeSection: { body: raw.themeSection?.body ?? '' },
    // Older docs predate the field; a missing value means "has a program" (ADR 0018).
    hasProgram: raw.hasProgram ?? true,
    artists: raw.artists ?? [],
    events: mapEvents(raw.events),
    carousel: mapCarousel(raw.carousel),
    credits: mapCredits(raw.credits),
  })
}
