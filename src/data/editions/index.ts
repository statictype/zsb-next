import { getEditionFromSanity, getEditionYearsFromSanity } from '@/sanity/lib/editions'
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

/**
 * 2021 stays as a static (online edition); never lives in Sanity.
 * All other in-person editions prefer Sanity, falling back to the
 * static file while migration is in progress.
 */
export async function getEdition(year: number): Promise<AnyEdition | undefined> {
  'use cache'
  if (year === 2021) return staticEditions[2021]
  const fromSanity = await getEditionFromSanity(year)
  if (fromSanity) return fromSanity
  return staticEditions[year]
}

export async function getAllEditionYears(): Promise<number[]> {
  'use cache'
  const sanityYears = await getEditionYearsFromSanity()
  const merged = new Set<number>([...Object.keys(staticEditions).map(Number), ...sanityYears])
  return [...merged].sort((a, b) => b - a)
}
