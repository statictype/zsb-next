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

/** Featured events of the newest edition; `undefined` when there is none or none is marked. */
export async function getFeaturedEvents(
  list: EditionSummary[],
  options: DynamicFetchOptions,
): Promise<FeaturedEvents | undefined> {
  const newest = list[0]
  if (!newest) return undefined
  const edition = await getEdition(newest.year, options)
  if (!edition) return undefined
  const featured = edition.events.filter((e) => e.featured)
  return featured.length ? { year: edition.year, events: featured } : undefined
}

export async function getAllEditionYearParams(): Promise<{ year: string }[]> {
  'use cache'
  const list = await getEditionSummaries(PUBLISHED)
  return list.map((e) => ({ year: String(e.year) }))
}

/** Reads the slugs `mapEvents` stamped on the cached per-year editions the pages prerender from. */
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

export async function getSitemapMetadata() {
  'use cache'
  return queryData(SITEMAP, PUBLISHED)
}
