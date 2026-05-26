import { edition2021 } from '@/data/editions/2021'
import { edition2022 } from '@/data/editions/2022'
import { edition2023 } from '@/data/editions/2023'
import { edition2024 } from '@/data/editions/2024'
import { edition2025 } from '@/data/editions/2025'

/**
 * Aggregated artist list across all ZSB editions (2021 → present).
 * Derived directly from the static edition objects so it can be used
 * synchronously (build-time scripts, banner counts). Eventually this
 * will move to a Sanity-backed query against the artist documents.
 */
export const ALL_ARTISTS: string[] = Array.from(
  new Set(
    [edition2021, edition2022, edition2023, edition2024, edition2025].flatMap((e) => e.artists),
  ),
).sort()
