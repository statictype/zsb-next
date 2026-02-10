import type { Edition } from '@/types/edition'
import { edition2022 } from './2022'
import { edition2023 } from './2023'
import { edition2024 } from './2024'
import { edition2025 } from './2025'

const editions: Record<number, Edition> = {
  2022: edition2022,
  2023: edition2023,
  2024: edition2024,
  2025: edition2025,
}

export function getEdition(year: number): Edition | undefined {
  return editions[year]
}

export function getAllEditionYears(): number[] {
  return Object.keys(editions)
    .map(Number)
    .sort((a, b) => b - a)
}
