import type { Lang } from '@/types/edition'

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
  if (s.y === e.y && s.m === e.m && s.d === e.d) return `${s.d} ${MONTHS[s.m - 1]} ${s.y}`
  if (s.y === e.y && s.m === e.m) return `${s.d}–${e.d} ${MONTHS[s.m - 1]} ${s.y}`
  if (s.y === e.y) return `${s.d} ${MONTHS[s.m - 1]} – ${e.d} ${MONTHS[e.m - 1]} ${e.y}`
  return `${s.d} ${MONTHS[s.m - 1]} ${s.y} – ${e.d} ${MONTHS[e.m - 1]} ${e.y}`
}

// The human date range face — "10–20 September 2026". Empty string if the
// dates are missing (only possible on a malformed doc — live editions require
// them).
export function composeDateRange(raw: {
  dateStart?: string | null
  dateEnd?: string | null
}): string {
  if (!raw.dateStart || !raw.dateEnd) return ''
  return formatDateRange(raw.dateStart, raw.dateEnd) ?? ''
}

// The yearless face — "16 Apr – 11 May". For surfaces that already set the
// edition year as its own element, where `composeDateRange` would repeat it.
export function composeDateSpan(raw: {
  dateStart?: string | null
  dateEnd?: string | null
}): string {
  if (!raw.dateStart || !raw.dateEnd) return ''
  return formatShortRange(raw.dateStart, raw.dateEnd) ?? ''
}

// Compose the hero date line from the typed fields. The mapper owns the `·`
// glyph so it stays consistent across editions. Empty string if the dates are
// missing (only possible on a malformed doc — live editions require them).
export function composeDateLine(raw: {
  dateStart?: string | null
  dateEnd?: string | null
  venueLine?: string | null
}): string {
  const range = composeDateRange(raw)
  if (!range) return ''
  return raw.venueLine ? `${range} · ${raw.venueLine}` : range
}

// ---- Program helpers (ZSB-28) ----

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

const RO_WEEKDAYS_SHORT = ['dum', 'lun', 'mar', 'mie', 'joi', 'vin', 'sâm'] as const
const RO_WEEKDAYS_LONG = [
  'duminică',
  'luni',
  'marți',
  'miercuri',
  'joi',
  'vineri',
  'sâmbătă',
] as const
const RO_MONTHS_SHORT = [
  'ian',
  'feb',
  'mar',
  'apr',
  'mai',
  'iun',
  'iul',
  'aug',
  'sep',
  'oct',
  'noi',
  'dec',
] as const
const RO_MONTHS = [
  'ianuarie',
  'februarie',
  'martie',
  'aprilie',
  'mai',
  'iunie',
  'iulie',
  'august',
  'septembrie',
  'octombrie',
  'noiembrie',
  'decembrie',
] as const

const CALENDAR = {
  en: {
    weekdays: WEEKDAYS_SHORT,
    weekdaysLong: WEEKDAYS_LONG,
    months: MONTHS_SHORT,
    monthsLong: MONTHS,
  },
  ro: {
    weekdays: RO_WEEKDAYS_SHORT,
    weekdaysLong: RO_WEEKDAYS_LONG,
    months: RO_MONTHS_SHORT,
    monthsLong: RO_MONTHS,
  },
} as const satisfies Record<Lang, Record<string, readonly string[]>>

export interface DayToken {
  weekday: string
  weekdayLong: string
  day: number
  /** Zero-padded day, for the big day-by-day numeral. */
  dayPadded: string
  month: string
  monthLong: string
  year: number
}

// Break an ISO `YYYY-MM-DD` into the pieces the day-by-day date marker renders.
// Weekday is derived via UTC so it never drifts by a day across timezones.
export function dayToken(iso: string, lang: Lang = 'en'): DayToken | undefined {
  const p = dateParts(iso)
  if (!p) return undefined
  const wd = new Date(Date.UTC(p.y, p.m - 1, p.d)).getUTCDay()
  const cal = CALENDAR[lang]
  return {
    weekday: cal.weekdays[wd] ?? '',
    weekdayLong: cal.weekdaysLong[wd] ?? '',
    day: p.d,
    dayPadded: String(p.d).padStart(2, '0'),
    month: cal.months[p.m - 1] ?? '',
    monthLong: cal.monthsLong[p.m - 1] ?? '',
    year: p.y,
  }
}

// A run is multi-day ("Ongoing") when it has an end date on a later calendar
// day than its start. ISO `YYYY-MM-DD` strings compare chronologically.
export function isMultiDayRun(startIso: string, endIso?: string | null): boolean {
  return Boolean(endIso) && (endIso as string) > startIso
}

// Compact span for the "Ongoing" run ranges, short months, year only when it spans
// one: "26 Apr – 11 May", same month "26–28 Apr", same day "24 Apr", cross-year
// full both sides.
export function formatShortRange(
  startIso: string,
  endIso: string,
  lang: Lang = 'en',
): string | undefined {
  const s = dateParts(startIso)
  const e = dateParts(endIso)
  if (!s || !e) return undefined
  const sm = CALENDAR[lang].months[s.m - 1]
  const em = CALENDAR[lang].months[e.m - 1]
  if (s.y === e.y && s.m === e.m && s.d === e.d) return `${s.d} ${sm}`
  if (s.y === e.y && s.m === e.m) return `${s.d}–${e.d} ${sm}`
  if (s.y === e.y) return `${s.d} ${sm} – ${e.d} ${em}`
  return `${s.d} ${sm} ${s.y} – ${e.d} ${em} ${e.y}`
}

// The fields the event-time judgements need. Typed structurally so this module
// stays free of CalendarEvent.
export interface EventWhen {
  startDate: string
  startTime?: string
  endTime?: string
  endDate?: string
}

export function timeLabel(event: Pick<EventWhen, 'startTime' | 'endTime'>): string {
  if (!event.startTime) return ''
  return event.endTime ? `${event.startTime}–${event.endTime}` : event.startTime
}

function whenLabel(event: EventWhen, register: 'long' | 'short', lang: Lang): string {
  if (isMultiDayRun(event.startDate, event.endDate)) {
    return formatShortRange(event.startDate, event.endDate as string, lang) ?? event.startDate
  }
  const token = dayToken(event.startDate, lang)
  const date = token
    ? register === 'long'
      ? `${token.weekdayLong} ${token.day} ${token.monthLong}`
      : `${token.weekday} ${token.day} ${token.month}`
    : event.startDate
  const time = timeLabel(event)
  return time ? `${date} · ${time}` : date
}

// The human "when" line for a single event — the run span for a multi-day
// "Ongoing" event, otherwise weekday·day·month plus the time when one is set.
// One implementation, two registers, so every surface phrases "when"
// identically: the long form for the event detail modal and the share card
// (ZSB-41), the short form for the poster cards and venue rows.
export function eventWhenLabel(event: EventWhen, lang: Lang = 'en'): string {
  return whenLabel(event, 'long', lang)
}

export function eventWhenLabelShort(event: EventWhen, lang: Lang = 'en'): string {
  return whenLabel(event, 'short', lang)
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

// ---- Edition window ----

// The full edition window [earliest start, latest end] across every event.
// Judged on the whole edition (never a filtered subset) so live/ended status
// stays stable as the program's filters change.
export function editionWindow(events: EventWhen[]): [string | null, string | null] {
  let start: string | null = null
  let end: string | null = null
  for (const e of events) {
    if (start === null || e.startDate < start) start = e.startDate
    const eEnd = eventEndIso(e)
    if (end === null || eEnd > end) end = eEnd
  }
  return [start, end]
}
