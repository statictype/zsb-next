import { PROGRAM_LABELS } from '@program/program-labels'
import { describe, expect, it } from 'vitest'

describe('PROGRAM_LABELS', () => {
  it('counts events in English', () => {
    const { count } = PROGRAM_LABELS.en
    expect(count({ total: 3, upcoming: 0, upcomingMatching: 0 })).toBe('3 events')
    expect(count({ total: 3, upcoming: 1, upcomingMatching: 1 })).toBe('1 upcoming event')
    expect(count({ total: 3, upcoming: 2, upcomingMatching: 1 })).toBe('1 of 2 upcoming events')
  })

  it('counts events in Romanian, with "de" from 20', () => {
    const { count, events } = PROGRAM_LABELS.ro
    expect(events(1)).toBe('un eveniment')
    expect(events(19)).toBe('19 evenimente')
    expect(events(20)).toBe('20 de evenimente')
    expect(events(101)).toBe('101 evenimente')
    expect(count({ total: 5, upcoming: 5, upcomingMatching: 5 })).toBe('5 evenimente viitoare')
    expect(count({ total: 5, upcoming: 5, upcomingMatching: 2 })).toBe(
      '2 din 5 evenimente viitoare',
    )
  })
})
