import { describe, expect, it } from 'vitest'
import {
  composeDateTape,
  dateParts,
  dayToken,
  eventEndIso,
  eventWhenLabel,
  eventWhenLabelShort,
  formatDateRange,
  formatShortRange,
  isMultiDayRun,
  isPastEvent,
} from './edition-dates'

describe('dateParts', () => {
  it('parses a YYYY-MM-DD string without a Date object', () => {
    expect(dateParts('2024-04-16')).toEqual({ y: 2024, m: 4, d: 16 })
  })

  it('rejects malformed or out-of-range input', () => {
    expect(dateParts('')).toBeUndefined()
    expect(dateParts('2024-04')).toBeUndefined()
    expect(dateParts('2024-13-01')).toBeUndefined()
    expect(dateParts('2024-00-10')).toBeUndefined()
    expect(dateParts('not-a-date')).toBeUndefined()
  })
})

describe('formatDateRange', () => {
  it('collapses a same-month range to one month + year', () => {
    expect(formatDateRange('2022-04-16', '2022-04-18')).toBe('16–18 April 2022')
  })

  it('spells out both months for a cross-month range in one year', () => {
    expect(formatDateRange('2024-04-16', '2024-05-11')).toBe('16 April – 11 May 2024')
  })

  it('spells out both sides fully for a cross-year range', () => {
    expect(formatDateRange('2024-12-30', '2025-01-02')).toBe('30 December 2024 – 2 January 2025')
  })

  it('returns undefined when either date is malformed', () => {
    expect(formatDateRange('2024-04-16', 'nope')).toBeUndefined()
    expect(formatDateRange('', '2024-04-18')).toBeUndefined()
  })
})

describe('composeDateTape', () => {
  it('appends the venue line after a middle dot', () => {
    expect(
      composeDateTape({ dateStart: '2022-04-16', dateEnd: '2022-04-18', venueLine: 'Bucharest' }),
    ).toBe('16–18 April 2022 · Bucharest')
  })

  it('omits the dot when there is no venue line', () => {
    expect(composeDateTape({ dateStart: '2022-04-16', dateEnd: '2022-04-18' })).toBe(
      '16–18 April 2022',
    )
  })

  it('returns an empty string when a date is missing', () => {
    expect(composeDateTape({ dateStart: '2022-04-16', dateEnd: null })).toBe('')
    expect(composeDateTape({ venueLine: 'Bucharest' })).toBe('')
  })

  it('returns an empty string when the dates are unparseable', () => {
    expect(composeDateTape({ dateStart: 'x', dateEnd: 'y', venueLine: 'Bucharest' })).toBe('')
  })
})

describe('dayToken', () => {
  it('derives the weekday via UTC so it never drifts a day', () => {
    // 2025-04-26 is a Saturday.
    expect(dayToken('2025-04-26')).toEqual({
      weekday: 'Sat',
      weekdayLong: 'Saturday',
      day: 26,
      dayPadded: '26',
      month: 'Apr',
      monthLong: 'April',
      year: 2025,
    })
  })

  it('zero-pads single-digit days for the agenda numeral', () => {
    expect(dayToken('2025-05-03')?.dayPadded).toBe('03')
  })

  it('returns undefined for a malformed date', () => {
    expect(dayToken('2025-13-40')).toBeUndefined()
  })
})

describe('isMultiDayRun', () => {
  it('is true only when the end date is on a later day', () => {
    expect(isMultiDayRun('2025-04-26', '2025-05-11')).toBe(true)
  })

  it('is false for a same-day end, a missing end, or an earlier end', () => {
    expect(isMultiDayRun('2025-04-26', '2025-04-26')).toBe(false)
    expect(isMultiDayRun('2025-04-26')).toBe(false)
    expect(isMultiDayRun('2025-04-26', null)).toBe(false)
    expect(isMultiDayRun('2025-04-26', '2025-04-25')).toBe(false)
  })
})

describe('formatShortRange', () => {
  it('collapses a same-month span to one short month', () => {
    expect(formatShortRange('2025-04-26', '2025-04-28')).toBe('26–28 Apr')
  })

  it('shows both short months for a cross-month span in one year', () => {
    expect(formatShortRange('2025-04-26', '2025-05-11')).toBe('26 Apr – 11 May')
  })

  it('spells out both sides with years for a cross-year span', () => {
    expect(formatShortRange('2024-12-30', '2025-01-02')).toBe('30 Dec 2024 – 2 Jan 2025')
  })

  it('returns undefined when either date is malformed', () => {
    expect(formatShortRange('2025-04-26', 'nope')).toBeUndefined()
  })
})

describe('eventWhenLabel / eventWhenLabelShort', () => {
  it('formats a single-day event with its time in both registers', () => {
    const ev = { startDate: '2026-05-15', startTime: '18:00' }
    expect(eventWhenLabel(ev)).toBe('Friday 15 May · 18:00')
    expect(eventWhenLabelShort(ev)).toBe('Fri 15 May · 18:00')
  })

  it('omits the time when none is set', () => {
    expect(eventWhenLabel({ startDate: '2026-05-15' })).toBe('Friday 15 May')
    expect(eventWhenLabelShort({ startDate: '2026-05-15' })).toBe('Fri 15 May')
  })

  it('shows the run span for a multi-day "Ongoing" event in both registers', () => {
    const run = { startDate: '2026-04-26', endDate: '2026-05-11', startTime: '18:00' }
    expect(eventWhenLabel(run)).toBe('26 Apr – 11 May')
    expect(eventWhenLabelShort(run)).toBe('26 Apr – 11 May')
  })

  it('falls back to the raw start date when it is malformed', () => {
    expect(eventWhenLabel({ startDate: 'nope' })).toBe('nope')
    expect(eventWhenLabelShort({ startDate: 'nope' })).toBe('nope')
  })
})

describe('eventEndIso / isPastEvent', () => {
  it('uses endDate for multi-day runs and startDate otherwise', () => {
    expect(eventEndIso({ startDate: '2026-04-10' })).toBe('2026-04-10')
    expect(eventEndIso({ startDate: '2026-04-10', endDate: '2026-04-20' })).toBe('2026-04-20')
  })

  it('treats an event as past only once its last day is before today', () => {
    const today = '2026-04-15'
    expect(isPastEvent({ startDate: '2026-04-14' }, today)).toBe(true)
    expect(isPastEvent({ startDate: '2026-04-15' }, today)).toBe(false)
    expect(isPastEvent({ startDate: '2026-04-01', endDate: '2026-04-20' }, today)).toBe(false)
    expect(isPastEvent({ startDate: '2026-04-01', endDate: '2026-04-14' }, today)).toBe(true)
  })
})
