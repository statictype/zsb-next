import { getAllEditionYears, getEdition } from '@/data/editions'

/**
 * Aggregated artist list across all ZSB editions (2021 → present).
 * Derived purely from registered editions so it can't drift.
 */
export const ALL_ARTISTS: string[] = Array.from(
  new Set(getAllEditionYears().flatMap((year) => getEdition(year)?.artists ?? [])),
).sort()
