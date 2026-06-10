// Shared latest/upcoming derivation for the decoupled per-surface edition
// controls (ADR 0016). Pure and framework-free so the home hero (ZSB-44) and the
// Visit venues view (ZSB-46) derive identically — and so it unit-tests cleanly.
//
// "Latest" = the most recent edition that has taken place (or is taking place);
// "Upcoming" = the next edition still ahead. Past-ness is judged against
// `todayIso`, which on the cached homepage / Visit page is resolved client-side
// (ADR 0012) — so this takes the date as an argument and never reads the clock.

/** Which of the two derived editions a surface's switch leads with. */
export type EditionLead = 'latest' | 'upcoming'

/** The minimum an edition needs to be placed on the latest/upcoming axis. */
export interface DerivableEdition {
  year: number
  /** ISO `YYYY-MM-DD` edition start. Absent for the online-only 2021 edition,
   *  which then falls back to its year — it is always long past either way. */
  dateStart?: string
}

export interface DerivedEditions<T> {
  /** Most recent edition that has started (or finished); null if none have. */
  latest: T | null
  /** Soonest edition still in the future; null when there is no next edition. */
  upcoming: T | null
}

// The comparable start instant: the real start when set, else Jan 1 of the
// edition year (coarse, but the only date-less editions are long past anyway).
function startOf(edition: DerivableEdition): string {
  return edition.dateStart ?? `${edition.year}-01-01`
}

/**
 * Split editions into the latest (most recent that has taken place) and the
 * upcoming (next still ahead), judged against `todayIso`. ISO `YYYY-MM-DD`
 * strings compare lexicographically, so no date parsing is needed. Recency is
 * ordered by `year`, which is unique per edition.
 *
 * `todayIso === null` is the pre-hydration server snapshot (the clock isn't
 * known yet): nothing can be proven to be in the future, so everything counts
 * as "taken place" — latest is the newest edition, upcoming is null. The client
 * re-derives with the real date once it mounts (the same split the calendar uses).
 */
export function deriveEditions<T extends DerivableEdition>(
  editions: readonly T[],
  todayIso: string | null,
): DerivedEditions<T> {
  let latest: T | null = null
  let upcoming: T | null = null

  for (const edition of editions) {
    const isFuture = todayIso !== null && startOf(edition) > todayIso
    if (isFuture) {
      // The next edition is the soonest of the futures.
      if (!upcoming || edition.year < upcoming.year) upcoming = edition
    } else if (!latest || edition.year > latest.year) {
      // The latest is the most recent of those that have taken place.
      latest = edition
    }
  }

  return { latest, upcoming }
}

/**
 * Resolve which edition a surface shows from its switch and the derived pair.
 * "Lead with Upcoming" falls back to Latest when there is no upcoming edition
 * (ADR 0016); "lead with Latest" always shows Latest.
 */
export function resolveLeadEdition<T>(
  lead: EditionLead,
  { latest, upcoming }: DerivedEditions<T>,
): T | null {
  if (lead === 'upcoming' && upcoming) return upcoming
  return latest
}
