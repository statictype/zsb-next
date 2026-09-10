import 'server-only'

import type { EditionCardData } from '@/components/EditionCard/EditionCard'
import { definedFields } from '@/lib/defined-fields'
import type { EditionLead } from '@/lib/derive-editions'
import { editionHref } from '@/lib/edition-href'
import { mapEdition, mapEditionCard } from '@/sanity/lib/editions-mappers'
import { type DynamicFetchOptions, PUBLISHED, queryData } from '@/sanity/lib/live'
import {
  EDITION_BY_YEAR,
  EDITION_CARDS,
  EDITION_YEARS,
  EDITIONS_LIST,
  HERO_EDITION,
  SITEMAP,
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
  const raw = await queryData(EDITION_BY_YEAR, options, { year })
  return raw ? mapEdition(raw) : undefined
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
  return (await queryData(HERO_EDITION, options)) === 'upcoming' ? 'upcoming' : 'latest'
}

/** One row per live edition, newest first. */
export interface EditionYearRow {
  year: number
}

/**
 * Cached live-edition years. Drafts never introduce or remove a year (year is
 * set on creation and rarely changes), so we hardcode published here.
 */
export async function getEditionYearsFromSanity(): Promise<EditionYearRow[]> {
  'use cache'
  return await queryData(EDITION_YEARS, PUBLISHED)
}

/**
 * The /editions archive cards in one card-shaped query — year, theme,
 * dateLine inputs, imagery — instead of a full-edition fetch per year.
 * Respects the caller's perspective so an editor can preview draft edits.
 */
export async function getEditionCardsFromSanity(
  options: DynamicFetchOptions,
): Promise<EditionCardData[]> {
  'use cache'
  const data = await queryData(EDITION_CARDS, options)
  return data.map(mapEditionCard)
}

/**
 * Update timestamps for the sitemap, in one query. Published-only — the
 * sitemap never previews drafts.
 */
export async function getSitemapMetadataFromSanity() {
  'use cache'
  return queryData(SITEMAP, PUBLISHED)
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
  const data = await queryData(EDITIONS_LIST, options)
  return data.flatMap((entry) => {
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
