export type EditionLead = 'latest' | 'upcoming'

export interface DerivableEdition {
  year: number
  dateStart?: string
}

export interface DerivedEditions<T> {
  latest: T | null
  upcoming: T | null
}

function startOf(edition: DerivableEdition): string {
  return edition.dateStart ?? `${edition.year}-01-01`
}

export function deriveEditions<T extends DerivableEdition>(
  editions: readonly T[],
  todayIso: string | null,
): DerivedEditions<T> {
  let latest: T | null = null
  let upcoming: T | null = null

  for (const edition of editions) {
    const isFuture = todayIso !== null && startOf(edition) > todayIso
    if (isFuture) {
      if (!upcoming || edition.year < upcoming.year) upcoming = edition
    } else if (!latest || edition.year > latest.year) {
      latest = edition
    }
  }

  return { latest, upcoming }
}
