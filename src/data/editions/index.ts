import {
  type EditionListItem,
  getEditionFromSanity,
  getEditionsListFromSanity,
  getEditionYearsFromSanity,
} from '@/sanity/lib/editions'
import type { DynamicFetchOptions } from '@/sanity/lib/live'
import type { AnyEdition } from '@/types/edition'
import { edition2021 } from './2021'
import { edition2022 } from './2022'
import { edition2023 } from './2023'
import { edition2024 } from './2024'
import { edition2025 } from './2025'

const staticEditions: Record<number, AnyEdition> = {
  2021: edition2021,
  2022: edition2022,
  2023: edition2023,
  2024: edition2024,
  2025: edition2025,
}

const STATIC_ONLY_YEARS = new Set([2021])

/**
 * 2021 stays as a static (online edition); never lives in Sanity.
 * Other in-person editions prefer Sanity, falling back to the static
 * file while migration is in progress.
 *
 * Caller MUST supply `options` (from `getDynamicFetchOptions`) so the
 * fetch can switch between published and draft perspectives. Static
 * fallback is unaffected.
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

export async function getAllEditionYears(): Promise<number[]> {
  'use cache'
  const sanityYears = await getEditionYearsFromSanity()
  const merged = new Set<number>([...Object.keys(staticEditions).map(Number), ...sanityYears])
  return [...merged].sort((a, b) => b - a)
}

/**
 * Merged edition list for the homepage cards. Sanity entries win when
 * both sources have the same year — Sanity is where `status` lives, so
 * an editor flipping an upcoming → published row updates the homepage.
 * Static fallback fills in years not yet authored in Sanity, always as
 * "published" (the page exists).
 */
export async function getEditionListItems(
  options: DynamicFetchOptions,
): Promise<EditionListItem[]> {
  const sanityList = await getEditionsListFromSanity(options)
  const sanityYears = new Set(sanityList.map((e) => e.year))

  const staticFallback: EditionListItem[] = Object.values(staticEditions)
    .filter((e) => !sanityYears.has(e.year))
    .map((e) => ({ year: e.year, theme: e.theme, status: 'published' as const }))

  return [...sanityList, ...staticFallback].sort((a, b) => b.year - a.year)
}
