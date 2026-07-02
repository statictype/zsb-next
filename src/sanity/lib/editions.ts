import 'server-only'

import { definedFields } from '@/lib/defined-fields'
import type { EditionLead } from '@/lib/derive-editions'
import type { Edition } from '@/types/edition'
import { mapEdition } from './editions-mappers'
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
  themeHighlight?: string
  status: 'upcoming' | 'live'
  /** ISO `YYYY-MM-DD` edition start, when set — lets the latest/upcoming
   *  derivation (ADR 0016) place this edition. Absent for the online 2021. */
  dateStart?: string
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
