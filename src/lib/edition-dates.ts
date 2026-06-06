// Pure date-formatting helpers for editions — no Sanity / `server-only`
// dependency so they stay trivially unit-testable and reusable by the
// calendar/event work (ZSB-28/25). Extracted from the edition mapper, which
// imports `composeDateTape` from here.

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
] as const

// Parse a stored `YYYY-MM-DD` date by hand (no Date object) to avoid timezone
// drift shifting the day.
export function dateParts(iso: string): { y: number; m: number; d: number } | undefined {
  const [y, m, d] = iso.split('-').map(Number)
  if (!y || !m || !d || m < 1 || m > 12) return undefined
  return { y, m, d }
}

// Canonical hero date string. Same month: "16–18 April 2022".
// Cross month: "16 April – 11 May 2024". Cross year (rare): full both sides.
export function formatDateRange(startIso: string, endIso: string): string | undefined {
  const s = dateParts(startIso)
  const e = dateParts(endIso)
  if (!s || !e) return undefined
  if (s.y === e.y && s.m === e.m) return `${s.d}–${e.d} ${MONTHS[s.m - 1]} ${s.y}`
  if (s.y === e.y) return `${s.d} ${MONTHS[s.m - 1]} – ${e.d} ${MONTHS[e.m - 1]} ${e.y}`
  return `${s.d} ${MONTHS[s.m - 1]} ${s.y} – ${e.d} ${MONTHS[e.m - 1]} ${e.y}`
}

// Compose the hero date tape from the typed fields. The mapper owns the `·`
// glyph so it stays consistent across editions. Empty string if the dates are
// missing (only possible on a malformed doc — live editions require them).
export function composeDateTape(raw: {
  dateStart?: string | null
  dateEnd?: string | null
  venueLine?: string | null
}): string {
  if (!raw.dateStart || !raw.dateEnd) return ''
  const range = formatDateRange(raw.dateStart, raw.dateEnd)
  if (!range) return ''
  return raw.venueLine ? `${range} · ${raw.venueLine}` : range
}
