import 'server-only'

import { type DerivedEditions, deriveEditions, type EditionLead } from '@/lib/derive-editions'
import { todayInBucharest } from '@/lib/today'
import { mapEdition, mapEditionSummary } from '@/sanity/lib/editions-mappers'
import { type DynamicFetchOptions, PUBLISHED, queryData } from '@/sanity/lib/live'
import { EDITION_BY_YEAR, EDITION_SUMMARIES, HERO_EDITION, SITEMAP } from '@/sanity/lib/queries'
import type { CalendarEvent, Edition, EditionSummary } from '@/types/edition'

export async function getEdition(
  year: number,
  options: DynamicFetchOptions,
): Promise<Edition | undefined> {
  'use cache'
  const raw = await queryData(EDITION_BY_YEAR, options, { year })
  return raw ? mapEdition(raw) : undefined
}

export async function getEditionSummaries(options: DynamicFetchOptions): Promise<EditionSummary[]> {
  'use cache'
  const data = await queryData(EDITION_SUMMARIES, options)
  return data.map(mapEditionSummary)
}

async function getHeroEditionLead(options: DynamicFetchOptions): Promise<EditionLead> {
  'use cache'
  return (await queryData(HERO_EDITION, options)) === 'upcoming' ? 'upcoming' : 'latest'
}

/**
 * The Latest/Upcoming edition pair (ADR 0016), judged against the server
 * fill-time clock (yearly tier, `lib/today.ts`). The one place that owns
 * "which editions are latest/upcoming right now".
 * Lightweight (list items, not full editions); `todayIso` is injectable
 * for tests.
 */
export async function getLatestAndUpcoming(
  options: DynamicFetchOptions,
  todayIso: string = todayInBucharest(),
): Promise<DerivedEditions<EditionSummary>> {
  const list = await getEditionSummaries(options)
  return deriveEditions(list, todayIso)
}

/**
 * The upcoming edition the home hero should lead with (ZSB-44) — returned only
 * when the hero switch is 'upcoming' AND there is a next edition to promote.
 * `null` means lead with Latest, i.e. render the standard homepage hero. The
 * lead pulls the edition's own theme + dates (it has no homepage photography of
 * its own yet); the kept Latest slideshow + CTA come from the homepage doc.
 */
export async function getHeroUpcoming(
  options: DynamicFetchOptions,
): Promise<EditionSummary | null> {
  const [lead, { upcoming }] = await Promise.all([
    getHeroEditionLead(options),
    getLatestAndUpcoming(options),
  ])
  return lead === 'upcoming' ? upcoming : null
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
  const list = await getEditionSummaries(options)
  const newestLive = list.find((e) => e.status === 'live')
  if (!newestLive) return undefined
  const edition = await getEdition(newestLive.year, options)
  if (!edition) return undefined
  const featured = edition.events.filter((e) => e.featured)
  return featured.length ? { year: edition.year, events: featured } : undefined
}

/**
 * Live edition years as route params — the generateStaticParams enumeration
 * shared by the edition page and its opengraph-image route. Published-only:
 * static params don't preview drafts.
 */
export async function getAllEditionYearParams(): Promise<{ year: string }[]> {
  'use cache'
  const list = await getEditionSummaries(PUBLISHED)
  return list.filter((e) => e.status === 'live').map((e) => ({ year: String(e.year) }))
}

/**
 * Every (year, slug) pair for every event across every edition — the
 * generateStaticParams enumeration shared by the event route and its
 * opengraph-image route (ADR 0015). Reads the slugs `mapEvents` stamped on the
 * same cached per-year editions the pages prerender from, so the enumerated
 * paths and the pages' own event identities cannot diverge.
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
 * Update timestamps for the sitemap, in one query. Published-only — the
 * sitemap never previews drafts.
 */
export async function getSitemapMetadata() {
  'use cache'
  return queryData(SITEMAP, PUBLISHED)
}
