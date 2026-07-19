import type { EditionCardData } from '@/components/EditionCard/EditionCard'
import { type DerivedEditions, deriveEditions, resolveLeadEdition } from '@/lib/derive-editions'
import { todayInBucharest } from '@/lib/today'
import { groupVenuesByType, type VenueTypeSection } from '@/lib/venues'
import {
  type EditionListItem,
  getEditionCardsFromSanity,
  getEditionFromSanity,
  getEditionsListFromSanity,
  getEditionYearsFromSanity,
  getHeroEditionLeadFromSanity,
  getVisitEditionLeadFromSanity,
} from '@/sanity/lib/editions'
import { type DynamicFetchOptions, type LivePerspective, PUBLISHED } from '@/sanity/lib/live'
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

/**
 * The Latest/Upcoming edition pair (ADR 0016), judged against the server
 * fill-time clock (yearly tier, `lib/today.ts`). The one place that owns
 * "which editions are latest/upcoming right now" — Visit and home-hero
 * resolve their switches against this shared pair, so they can't drift.
 * Lightweight (list items, not full editions); `todayIso` is injectable
 * for tests.
 */
export async function getLatestAndUpcoming(
  options: DynamicFetchOptions,
  todayIso: string = todayInBucharest(),
): Promise<DerivedEditions<EditionListItem>> {
  const list = await getEditionListItems(options)
  return deriveEditions(list, todayIso)
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
 * of the newest **live** edition (its routes are reachable, unlike an announced
 * one). `undefined` when there's no live physical edition or nothing is marked.
 * Picking the edition is the yearly-tier server decision; `FeaturedSpotlight`
 * hides past events client-side (daily tier, `lib/today.ts`).
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

/** Every edition year, announced included — the "N editions" counts on the
 *  /artists page and the homepage banner. */
export async function getAllEditionYears(): Promise<number[]> {
  'use cache'
  const rows = await getEditionYearsFromSanity()
  return rows.map((row) => row.year)
}

/**
 * Live edition years as route params — the generateStaticParams enumeration
 * shared by the edition page and its opengraph-image route. Only live years
 * qualify: the page is gated `status == "live"`, so prerendering any other
 * year would bake a 404.
 */
export async function getAllEditionYearParams(): Promise<{ year: string }[]> {
  'use cache'
  const rows = await getEditionYearsFromSanity()
  return rows.filter((row) => row.status === 'live').map((row) => ({ year: String(row.year) }))
}

/**
 * The /editions archive cards, newest first — one card-shaped query instead
 * of a full-edition fetch per year.
 */
export async function getEditionCards(options: DynamicFetchOptions): Promise<EditionCardData[]> {
  return getEditionCardsFromSanity(options)
}

/**
 * A single edition for generateMetadata — resolves the caller's perspective
 * (so the Presentation tool can preview drafts) with no stega, shared by the
 * edition page and the event page's metadata.
 */
export async function getEditionForMetadata(
  year: number,
  perspective: LivePerspective,
): Promise<Edition | undefined> {
  return getEdition(year, { perspective })
}

/**
 * Every (year, slug) pair for every event across every edition — the
 * generateStaticParams enumeration shared by the event route and its
 * opengraph-image route (ADR 0015). Reads the slugs `mapEvents` stamped on the
 * same cached per-year editions the pages prerender from, so the enumerated
 * paths and the pages' own event identities cannot diverge. Live years only
 * (via `getAllEditionYearParams`), published-only: static params don't
 * preview drafts.
 */
export async function getAllEventParams(): Promise<{ year: string; slug: string }[]> {
  'use cache'
  const years = await getAllEditionYearParams()
  const perYear = await Promise.all(
    years.map(async ({ year }) => {
      const edition = await getEdition(Number(year), PUBLISHED)
      return (edition?.events ?? []).map((event) => ({ year, slug: event.slug }))
    }),
  )
  return perYear.flat()
}

/**
 * Edition list for the homepage cards, newest first. `status` (where an editor
 * flips an announced → live row) lives in Sanity, so this is a straight pass of
 * the Sanity list (already year-desc from the query).
 */
export async function getEditionListItems(
  options: DynamicFetchOptions,
): Promise<EditionListItem[]> {
  return getEditionsListFromSanity(options)
}
