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

// ---- Calendar helpers (ZSB-28) ----

const WEEKDAYS_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const
const WEEKDAYS_LONG = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
] as const
const MONTHS_SHORT = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
] as const

export interface DayToken {
  weekday: string
  weekdayLong: string
  day: number
  /** Zero-padded day, for the big agenda numeral. */
  dayPadded: string
  month: string
  monthLong: string
  year: number
}

// Break an ISO `YYYY-MM-DD` into the pieces the agenda date marker renders.
// Weekday is derived via UTC so it never drifts by a day across timezones.
export function dayToken(iso: string): DayToken | undefined {
  const p = dateParts(iso)
  if (!p) return undefined
  const wd = new Date(Date.UTC(p.y, p.m - 1, p.d)).getUTCDay()
  return {
    weekday: WEEKDAYS_SHORT[wd] ?? '',
    weekdayLong: WEEKDAYS_LONG[wd] ?? '',
    day: p.d,
    dayPadded: String(p.d).padStart(2, '0'),
    month: MONTHS_SHORT[p.m - 1] ?? '',
    monthLong: MONTHS[p.m - 1] ?? '',
    year: p.y,
  }
}

// A run is multi-day ("Ongoing") when it has an end date on a later calendar
// day than its start. ISO `YYYY-MM-DD` strings compare chronologically.
export function isMultiDayRun(startIso: string, endIso?: string | null): boolean {
  return Boolean(endIso) && (endIso as string) > startIso
}

// Compact span for the "Ongoing" run ranges, short months, year only when it spans
// one: "26 Apr – 11 May", same month "26–28 Apr", cross-year full both sides.
export function formatShortRange(startIso: string, endIso: string): string | undefined {
  const s = dateParts(startIso)
  const e = dateParts(endIso)
  if (!s || !e) return undefined
  const sm = MONTHS_SHORT[s.m - 1]
  const em = MONTHS_SHORT[e.m - 1]
  if (s.y === e.y && s.m === e.m) return `${s.d}–${e.d} ${sm}`
  if (s.y === e.y) return `${s.d} ${sm} – ${e.d} ${em}`
  return `${s.d} ${sm} ${s.y} – ${e.d} ${em} ${e.y}`
}

// The fields the event-time judgements need. Typed structurally so this module
// stays free of CalendarEvent.
export interface EventWhen {
  startDate: string
  startTime?: string
  endDate?: string
}

function whenLabel(event: EventWhen, register: 'long' | 'short'): string {
  if (isMultiDayRun(event.startDate, event.endDate)) {
    return formatShortRange(event.startDate, event.endDate as string) ?? event.startDate
  }
  const token = dayToken(event.startDate)
  const date = token
    ? register === 'long'
      ? `${token.weekdayLong} ${token.day} ${token.monthLong}`
      : `${token.weekday} ${token.day} ${token.month}`
    : event.startDate
  return event.startTime ? `${date} · ${event.startTime}` : date
}

// The human "when" line for a single event — the run span for a multi-day
// "Ongoing" event, otherwise weekday·day·month plus the time when one is set.
// One implementation, two registers, so every surface phrases "when"
// identically: the long form for the event detail modal and the share card
// (ZSB-41), the short form for the poster cards and venue rows.
export function eventWhenLabel(event: EventWhen): string {
  return whenLabel(event, 'long')
}

export function eventWhenLabelShort(event: EventWhen): string {
  return whenLabel(event, 'short')
}

// ---- Past / upcoming judgement ----

// The last calendar day an event occupies: its end date for a multi-day run,
// otherwise its start date.
export function eventEndIso(event: EventWhen): string {
  return event.endDate ?? event.startDate
}

// An event is past once its last day is before today. Today's events — and a
// multi-day run still within its window — are never past. ISO `YYYY-MM-DD`
// strings compare chronologically, so this is a plain string compare.
export function isPastEvent(event: EventWhen, todayIso: string): boolean {
  return eventEndIso(event) < todayIso
}
