import 'server-only'

import type { EditionCardData } from '@/components/EditionCard/EditionCard'
import { definedFields } from '@/lib/defined-fields'
import type { EditionLead } from '@/lib/derive-editions'
import { editionHref } from '@/lib/edition-href'
import { mapEdition, mapEditionCard } from '@/sanity/lib/editions-mappers'
import { type DynamicFetchOptions, PUBLISHED, queryData } from '@/sanity/lib/live'
import {
  EDITION_BY_YEAR_QUERY,
  EDITION_CARDS_QUERY,
  EDITION_YEARS_QUERY,
  EDITIONS_LIST_QUERY,
  HERO_EDITION_QUERY,
  SITEMAP_QUERY,
  VISIT_EDITION_QUERY,
} from '@/sanity/lib/queries'
import type { Edition } from '@/types/edition'

export interface EditionListItem {
  year: number
  theme: string
  themeHighlight?: string
  status: 'announced' | 'live'

  href?: string
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
  status: 'live' | 'announced'
}

/**
 * Cached year+status rows. Drafts never introduce or remove a year (year is
 * set on creation and rarely changes), so we hardcode published here. Two
 * consumers, two views: the "N editions" counts read every row, the
 * generateStaticParams enumeration keeps only live.
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
 * announced-edition draft on the homepage, so this respects the
 * perspective the caller resolved.
 */
export async function getEditionsListFromSanity(
  options: DynamicFetchOptions,
): Promise<EditionListItem[]> {
  'use cache'
  const data = await queryData(EDITIONS_LIST_QUERY, options)
  return (data ?? []).flatMap((entry) => {
    if (!entry.year || !entry.theme) return []
    const status = entry.status === 'live' ? ('live' as const) : ('announced' as const)
    return [
      definedFields({
        year: entry.year,
        theme: entry.theme,
        themeHighlight: entry.themeHighlight ?? '',
        status,
        href: status === 'live' ? editionHref(entry.year) : undefined,
        dateStart: entry.dateStart,
      }),
    ]
  })
}
