import { type DerivedEditions, deriveEditions, resolveLeadEdition } from '@/lib/derive-editions'
import { groupVenuesByType, type VenueTypeSection } from '@/lib/venues'
import {
  type EditionListItem,
  getEditionFromSanity,
  getEditionsListFromSanity,
  getEditionYearsFromSanity,
  getHeroEditionLeadFromSanity,
  getVisitEditionLeadFromSanity,
} from '@/sanity/lib/editions'
import { type DynamicFetchOptions, PUBLISHED } from '@/sanity/lib/live'
import type { CalendarEvent, Edition } from '@/types/edition'

/**
 * Every edition lives in Sanity (2021 was migrated in ZSB-20, ADR 0018, retiring
 * the last static file). Caller MUST supply `options` (from
 * `getDynamicFetchOptions`) so the fetch can switch between published and draft
 * perspectives.
 */
export async function getEdition(
  year: number,
  options: DynamicFetchOptions,
): Promise<Edition | undefined> {
  return getEditionFromSanity(year, options)
}

// Local "today" as ISO `YYYY-MM-DD`. Read inside `getLatestAndUpcoming` — itself
// called within a surface's cache boundary — so the latest/upcoming split is
// fixed at cache-fill time and refreshes on revalidation (which includes the
// editor flipping a surface switch). The surfaces aren't date-critical to the
// minute, so this fill-time snapshot is the deliberate, simple choice (ADR 0016).
function todayIso(): string {
  const d = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

/**
 * The Latest/Upcoming edition pair for the current request (ADR 0016): the
 * edition list derived against today's date, read at cache-fill time. The one
 * place that owns "which editions are latest/upcoming right now" — the Visit and
 * home-hero surfaces each resolve their own switch against this shared pair, so
 * they can't drift. Lightweight (list items, not full editions); a caller loads
 * the one it picks via `getEdition`.
 */
export async function getLatestAndUpcoming(
  options: DynamicFetchOptions,
): Promise<DerivedEditions<EditionListItem>> {
  const list = await getEditionListItems(options)
  return deriveEditions(list, todayIso())
}

/** The Visit page's venues view: the resolved edition's year plus its events
 *  grouped into venue-type sections, built here (ZSB-65) so the component is a
 *  pure renderer and shares the calendar's venue rollup. */
export interface VisitVenues {
  year: number
  sections: VenueTypeSection[]
}

/**
 * The venues view shown on the Visit page (ZSB-46): the Visit switch
 * (latest|upcoming) resolved against the derived editions (ADR 0016), falling
 * back to Latest when the switch is 'upcoming' but nothing is ahead. `undefined`
 * when there are no eligible editions or the edition has no events to group (the
 * online-only 2021 has none, so it naturally yields nothing).
 */
export async function getVisitEdition(
  options: DynamicFetchOptions,
): Promise<VisitVenues | undefined> {
  const [lead, pair] = await Promise.all([
    getVisitEditionLeadFromSanity(options),
    getLatestAndUpcoming(options),
  ])
  const chosen = resolveLeadEdition(lead, pair)
  if (!chosen) return undefined
  const edition = await getEdition(chosen.year, options)
  if (!edition) return undefined
  const sections = groupVenuesByType(edition.events ?? [])
  return sections.length ? { year: edition.year, sections } : undefined
}

/** The upcoming edition the home hero leads with (ZSB-44), once auto-derived. */
export interface UpcomingHero {
  year: number
  theme: string
  themeHighlight: string
  /** Composed human date string, e.g. "10–20 September 2026". */
  dateTape: string
}

/**
 * The upcoming edition the home hero should lead with (ZSB-44) — returned only
 * when the hero switch is 'upcoming' AND there is a next edition to promote.
 * `null` means lead with Latest, i.e. render the standard homepage hero. The
 * lead pulls the edition's own theme + dates (it has no homepage photography of
 * its own yet); the kept Latest slideshow + CTA come from the homepage doc.
 */
export async function getHeroUpcoming(options: DynamicFetchOptions): Promise<UpcomingHero | null> {
  const [lead, { upcoming }] = await Promise.all([
    getHeroEditionLeadFromSanity(options),
    getLatestAndUpcoming(options),
  ])
  if (lead !== 'upcoming' || !upcoming) return null
  const edition = await getEdition(upcoming.year, options)
  if (!edition) return null
  return {
    year: edition.year,
    theme: edition.theme,
    themeHighlight: edition.themeHighlight,
    dateTape: edition.dateTape,
  }
}

/**
 * The homepage featured spotlight's source (ZSB-44): the `featured`-marked events
 * of the newest **live** edition (its routes are reachable, unlike an upcoming
 * one). `undefined` when there's no live physical edition or nothing is marked.
 * Past events are hidden client-side by the consumer, not here.
 */
export async function getFeaturedEvents(
  options: DynamicFetchOptions,
): Promise<{ year: number; events: CalendarEvent[] } | undefined> {
  const list = await getEditionListItems(options)
  // `list` is sorted year-desc, so the first live entry is the newest live edition.
  const newestLive = list.find((e) => e.status === 'live')
  if (!newestLive) return undefined
  const edition = await getEdition(newestLive.year, options)
  if (!edition) return undefined
  const featured = edition.events?.filter((e) => e.featured) ?? []
  return featured.length ? { year: edition.year, events: featured } : undefined
}

export async function getAllEditionYears(): Promise<number[]> {
  'use cache'
  return getEditionYearsFromSanity()
}

/**
 * Every (year, slug) pair for every event across every edition — the
 * generateStaticParams enumeration shared by the event route and its
 * opengraph-image route (ADR 0015), so a change to slug derivation in
 * `mapEvents` only needs remembering in one place.
 */
export async function getAllEventParams(): Promise<{ year: string; slug: string }[]> {
  'use cache'
  const years = await getAllEditionYears()
  const params: { year: string; slug: string }[] = []
  for (const year of years) {
    const edition = await getEdition(year, PUBLISHED)
    if (!edition) continue
    for (const event of edition.events ?? []) {
      params.push({ year: String(year), slug: event.slug })
    }
  }
  return params
}

/**
 * Edition list for the homepage cards, newest first. `status` (where an editor
 * flips an upcoming → live row) lives in Sanity, so this is a straight pass of
 * the Sanity list (already year-desc from the query).
 */
export async function getEditionListItems(
  options: DynamicFetchOptions,
): Promise<EditionListItem[]> {
  return getEditionsListFromSanity(options)
}
