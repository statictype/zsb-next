import { deriveEditions, resolveLeadEdition } from '@/lib/derive-editions'
import {
  type EditionListItem,
  getEditionFromSanity,
  getEditionsListFromSanity,
  getEditionYearsFromSanity,
  getHeroEditionLeadFromSanity,
  getVisitEditionLeadFromSanity,
} from '@/sanity/lib/editions'
import type { DynamicFetchOptions } from '@/sanity/lib/live'
import { type AnyEdition, type CalendarEvent, type Edition, isOnlineEdition } from '@/types/edition'
import { edition2021 } from './2021'

// 2021 is the only static edition — the online-only year, never migrated
// to Sanity (unique shape, no editorial value to re-author). Every other
// year lives in Sanity; the static-fallback files for 2022–2025 were
// deleted once those editions were fully authored there.
const staticEditions: Record<number, AnyEdition> = {
  2021: edition2021,
}

const STATIC_ONLY_YEARS = new Set([2021])

/**
 * 2021 is served from its static file; never lives in Sanity. Every other
 * year is fetched from Sanity.
 *
 * Caller MUST supply `options` (from `getDynamicFetchOptions`) so the
 * fetch can switch between published and draft perspectives. The 2021
 * static path is unaffected.
 */
export async function getEdition(
  year: number,
  options: DynamicFetchOptions,
): Promise<AnyEdition | undefined> {
  if (STATIC_ONLY_YEARS.has(year)) return staticEditions[year]
  const fromSanity = await getEditionFromSanity(year, options)
  if (fromSanity) return fromSanity
  return staticEditions[year]
}

// Local "today" as ISO `YYYY-MM-DD`. Read where `getVisitEdition` runs — inside
// the Visit page's cache boundary — so the latest/upcoming split is fixed at
// cache-fill time and refreshes on revalidation (which includes the editor
// flipping the Visit switch). Visit isn't date-critical to the minute, so this
// fill-time snapshot is the deliberate, simple choice (ADR 0016).
function todayIso(): string {
  const d = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

/**
 * The edition shown on the Visit page's venues view (ZSB-46): the Visit switch
 * (latest|upcoming) resolved against the derived editions (ADR 0016), falling
 * back to Latest when the switch is 'upcoming' but nothing is ahead. `undefined`
 * when there are no eligible editions, or the pick is the online-only 2021 (no
 * physical venues to show).
 */
export async function getVisitEdition(options: DynamicFetchOptions): Promise<Edition | undefined> {
  const [lead, list] = await Promise.all([
    getVisitEditionLeadFromSanity(options),
    getEditionListItems(options),
  ])
  const chosen = resolveLeadEdition(lead, deriveEditions(list, todayIso()))
  if (!chosen) return undefined
  const edition = await getEdition(chosen.year, options)
  return edition && !isOnlineEdition(edition) ? edition : undefined
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
  const [lead, list] = await Promise.all([
    getHeroEditionLeadFromSanity(options),
    getEditionListItems(options),
  ])
  if (lead !== 'upcoming') return null
  const { upcoming } = deriveEditions(list, todayIso())
  if (!upcoming) return null
  const edition = await getEdition(upcoming.year, options)
  if (!edition || isOnlineEdition(edition)) return null
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
  if (!edition || isOnlineEdition(edition)) return undefined
  const featured = edition.events?.filter((e) => e.featured) ?? []
  return featured.length ? { year: edition.year, events: featured } : undefined
}

export async function getAllEditionYears(): Promise<number[]> {
  'use cache'
  const sanityYears = await getEditionYearsFromSanity()
  const merged = new Set<number>([...Object.keys(staticEditions).map(Number), ...sanityYears])
  return [...merged].sort((a, b) => b - a)
}

/**
 * Merged edition list for the homepage cards. Sanity entries win when
 * both sources have the same year — Sanity is where `status` lives, so
 * an editor flipping an upcoming → live row updates the homepage.
 * Static fallback fills in years not yet authored in Sanity, always as
 * "live" (the page exists).
 */
export async function getEditionListItems(
  options: DynamicFetchOptions,
): Promise<EditionListItem[]> {
  const sanityList = await getEditionsListFromSanity(options)
  const sanityYears = new Set(sanityList.map((e) => e.year))

  const staticFallback: EditionListItem[] = Object.values(staticEditions)
    .filter((e) => !sanityYears.has(e.year))
    .map((e) => ({ year: e.year, theme: e.theme, status: 'live' as const }))

  return [...sanityList, ...staticFallback].sort((a, b) => b.year - a.year)
}
