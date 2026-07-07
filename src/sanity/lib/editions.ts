import 'server-only'

import type { EditionCardData } from '@/components/EditionCard/EditionCard'
import { definedFields } from '@/lib/defined-fields'
import type { EditionLead } from '@/lib/derive-editions'
import type { Edition } from '@/types/edition'
import { deriveEventSlugs, mapEdition, mapEditionCard } from './editions-mappers'
import { type DynamicFetchOptions, PUBLISHED, queryData } from './live'
import {
  EDITION_BY_YEAR_QUERY,
  EDITION_CARDS_QUERY,
  EDITION_YEARS_QUERY,
  EDITIONS_LIST_QUERY,
  EVENT_PATHS_QUERY,
  HERO_EDITION_QUERY,
  SITEMAP_QUERY,
  VISIT_EDITION_QUERY,
} from './queries'

export interface EditionListItem {
  year: number
  theme: string
  themeHighlight?: string
  status: 'upcoming' | 'live'
  /** ISO `YYYY-MM-DD` edition start, when set — lets the latest/upcoming
   *  derivation (ADR 0016) place this edition. Absent for the online 2021. */
  dateStart?: string
}

/**
 * Cached fetch of a single edition. Caller must pass perspective
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

/** One row per edition, newest first — year plus the status that decides
 *  whether the edition has a reachable page. */
export interface EditionYearRow {
  year: number
  status: 'live' | 'upcoming'
}

/**
 * Cached year+status rows. Drafts never introduce or remove a year (year is
 * set on creation and rarely changes), so we hardcode published here. Two
 * consumers, two views: the "N editions" counts read every row, the
 * generateStaticParams enumeration filters out upcoming.
 */
export async function getEditionYearsFromSanity(): Promise<EditionYearRow[]> {
  'use cache'
  return (await queryData(EDITION_YEARS_QUERY, PUBLISHED)) ?? []
}

/**
 * The /editions archive cards in one card-shaped query — year, theme tape,
 * dateTape inputs, imagery — instead of a full-edition fetch per year.
 * Respects the caller's perspective so an editor can preview draft edits.
 */
export async function getEditionCardsFromSanity(
  options: DynamicFetchOptions,
): Promise<EditionCardData[]> {
  'use cache'
  const data = await queryData(EDITION_CARDS_QUERY, options)
  return (data ?? []).map(mapEditionCard)
}

/**
 * Every (year, slug) pair for every event across every edition, in one query —
 * the sparse projection behind `getAllEventParams`. Runs events through the
 * same `deriveEventSlugs` (ADR 0015) `mapEvents` uses, so an event without an
 * editor-set slug still resolves to its real, derived one rather than being
 * silently dropped. Published-only, same as `getEditionYearsFromSanity`:
 * static params don't preview drafts.
 */
export async function getEventPathsFromSanity(): Promise<{ year: string; slug: string }[]> {
  'use cache'
  const data = await queryData(EVENT_PATHS_QUERY, PUBLISHED)
  return (data ?? []).flatMap((entry) =>
    deriveEventSlugs(entry.events ?? []).map((slug) => ({ year: String(entry.year), slug })),
  )
}

/**
 * Update timestamps for the sitemap, in one query. Published-only — the
 * sitemap never previews drafts.
 */
export async function getSitemapMetadataFromSanity() {
  'use cache'
  return queryData(SITEMAP_QUERY, PUBLISHED)
}

/**
 * Lightweight edition list for the homepage cards. Returns just
 * `{ year, theme, themeHighlight, status }` per edition. Editor may want to preview an
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
      definedFields({
        year: entry.year,
        theme: entry.theme,
        themeHighlight: entry.themeHighlight ?? '',
        status: entry.status === 'upcoming' ? ('upcoming' as const) : ('live' as const),
        dateStart: entry.dateStart,
      }),
    ]
  })
}
