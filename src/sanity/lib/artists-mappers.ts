import type { ARTIST_CLOUD_QUERY_RESULT } from '@/../sanity.types'
import { ONLINE_EDITION_YEARS } from '@/lib/constants'
import type { ArtistCloudItem, ArtistTier } from '@/types/edition'

const TIERS = [1, 2, 3, 4, 5] as const satisfies readonly ArtistTier[]

export function artistTier(inPerson: number, maxObserved: number): ArtistTier {
  if (maxObserved <= 0) return TIERS[0]
  const step = Math.ceil((inPerson / maxObserved) * TIERS.length)
  return TIERS[Math.min(Math.max(step, 1), TIERS.length) - 1] ?? TIERS[0]
}

export const EDITION_YEAR_SEPARATOR = ', '

export function formatEditionYearList(years: readonly number[]): string[] {
  return [...years]
    .sort((a, b) => a - b)
    .map((year) => (ONLINE_EDITION_YEARS.includes(year) ? `${year} (online)` : String(year)))
}

export function formatEditionYears(years: readonly number[]): string {
  return formatEditionYearList(years).join(EDITION_YEAR_SEPARATOR)
}

export function mapArtistCloud(raw: ARTIST_CLOUD_QUERY_RESULT): ArtistCloudItem[] {
  const yearsById = new Map<string, number[]>()
  for (const edition of raw.editions) {
    for (const ref of edition.refs ?? []) {
      const seen = yearsById.get(ref)
      if (seen === undefined) yearsById.set(ref, [edition.year])
      else if (!seen.includes(edition.year)) seen.push(edition.year)
    }
  }

  const shown = raw.artists.flatMap(({ _id, name }) => {
    const years = yearsById.get(_id)
    if (years === undefined) return []
    const inPerson = years.filter((year) => !ONLINE_EDITION_YEARS.includes(year)).length
    return [{ _id, name, years: [...years].sort((a, b) => a - b), inPerson }]
  })

  const maxObserved = shown.reduce((max, entry) => Math.max(max, entry.inPerson), 0)

  return shown.map(({ _id, name, years, inPerson }) => ({
    _id,
    name,
    years,
    tier: artistTier(inPerson, maxObserved),
  }))
}
