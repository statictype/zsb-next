export function padNum(n: number, len = 2): string {
  return String(n).padStart(len, '0')
}

export function splitInHalf<T>(arr: T[]): [T[], T[]] {
  const mid = Math.ceil(arr.length / 2)
  return [arr.slice(0, mid), arr.slice(mid)]
}

/**
 * Surname-first ordering key for a full "First Last" name, used to sort
 * artists by last name while still displaying them first-name-first.
 * "Andreea Eftene" → "Eftene Andreea". Single-token names (mononyms,
 * collectives) are returned unchanged. This is a heuristic default — it
 * assumes the last whitespace token is the surname, which is wrong for
 * particles ("van der", "de la") and some double surnames; those are
 * meant to be overridden via the artist's `sortName` field in Sanity.
 * Consumed by scripts/sanity-backfill-artist-sortname.ts; app-side sorting
 * reads the backfilled `sortName` from Sanity instead of recomputing.
 */
export function surnameSortKey(name: string): string {
  const parts = name.trim().split(/\s+/)
  if (parts.length < 2) return name.trim()
  const last = parts[parts.length - 1]
  const rest = parts.slice(0, -1).join(' ')
  return `${last} ${rest}`
}
