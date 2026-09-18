import 'server-only'

import type { EditionLead } from '@/lib/derive-editions'
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

export async function getHeroEditionLead(options: DynamicFetchOptions): Promise<EditionLead> {
  'use cache'
  return (await queryData(HERO_EDITION, options)) === 'upcoming' ? 'upcoming' : 'latest'
}

export interface FeaturedEvents {
  year: number
  events: CalendarEvent[]
}

/**
 * The homepage featured spotlight's source (ZSB-44): the `featured`-marked events
 * of the newest **live** edition (its routes are reachable, unlike an announced
 * one). `undefined` when there's no live physical edition or nothing is marked.
 * Picking the edition is the yearly-tier server decision; `FeaturedSpotlight`
 * hides past events client-side (daily tier, `lib/today.ts`).
 */
export async function getFeaturedEvents(
  list: EditionSummary[],
  options: DynamicFetchOptions,
): Promise<FeaturedEvents | undefined> {
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
