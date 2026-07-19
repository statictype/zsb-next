import { describe, expect, it } from 'vitest'
import { todayInBucharest } from '@/lib/today'

describe('todayInBucharest', () => {
  it('formats as zero-padded YYYY-MM-DD', () => {
    expect(todayInBucharest(new Date('2026-01-05T10:00:00Z'))).toBe('2026-01-05')
  })

  it('rolls to the next day at Bucharest midnight while UTC lags behind', () => {
    expect(todayInBucharest(new Date('2026-07-18T20:59:00Z'))).toBe('2026-07-18')
    expect(todayInBucharest(new Date('2026-07-18T21:00:00Z'))).toBe('2026-07-19')
  })

  it('ignores zones west of Bucharest still on the previous day', () => {
    // 2026-07-19T02:00Z: New York is 2026-07-18 22:00, Bucharest 05:00 the 19th.
    expect(todayInBucharest(new Date('2026-07-19T02:00:00Z'))).toBe('2026-07-19')
  })

  it('uses the EET (+02:00) offset before the spring DST switch', () => {
    // Clocks jump 03:00 → 04:00 at 2026-03-29T01:00Z.
    expect(todayInBucharest(new Date('2026-03-28T21:30:00Z'))).toBe('2026-03-28')
    expect(todayInBucharest(new Date('2026-03-28T22:00:00Z'))).toBe('2026-03-29')
  })

  it('uses the EEST (+03:00) offset until the autumn DST switch', () => {
    // Clocks fall back 04:00 → 03:00 at 2026-10-25T01:00Z.
    expect(todayInBucharest(new Date('2026-10-24T21:00:00Z'))).toBe('2026-10-25')
    expect(todayInBucharest(new Date('2026-10-25T21:30:00Z'))).toBe('2026-10-25')
    expect(todayInBucharest(new Date('2026-10-25T22:00:00Z'))).toBe('2026-10-26')
  })
})
