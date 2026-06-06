import { describe, expect, it } from 'vitest'
import { composeDateTape, dateParts, formatDateRange } from './edition-dates'

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
