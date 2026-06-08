import {
  type EditionListItem,
  getCurrentEditionYearFromSanity,
  getEditionFromSanity,
  getEditionsListFromSanity,
  getEditionYearsFromSanity,
} from '@/sanity/lib/editions'
import type { DynamicFetchOptions } from '@/sanity/lib/live'
import { type AnyEdition, type Edition, isOnlineEdition } from '@/types/edition'
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

/**
 * The edition the team has marked current (ZSB-36) — the one whose programme
 * the homepage featured events and the Visit-page venues list read from.
 * `undefined` when the setting is unset (the site never guesses) or, defensively,
 * when it points at the online-only 2021 edition (no events/venues to show).
 */
export async function getCurrentEdition(
  options: DynamicFetchOptions,
): Promise<Edition | undefined> {
  const year = await getCurrentEditionYearFromSanity(options)
  if (year === null) return undefined
  const edition = await getEdition(year, options)
  return edition && !isOnlineEdition(edition) ? edition : undefined
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
