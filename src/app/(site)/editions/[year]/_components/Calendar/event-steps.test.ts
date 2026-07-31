import { eventSteps } from '@calendar/event-steps'
import { describe, expect, it } from 'vitest'
import { rollUpVenue } from '@/lib/venues'
import type { CalendarEvent, EventVenue } from '@/types/edition'

const CFP = 'Combinatul Fondului Plastic'

// Mirrors the factory in calendar-filters.test.ts — only the fields the step
// derivation touches, with the venue stamped by the real roll-up rule.
function ev(
  partial: Partial<Omit<CalendarEvent, 'venue'>> &
    Pick<CalendarEvent, 'key' | 'startDate'> & { venue?: Omit<EventVenue, 'rollUp'> },
): CalendarEvent {
  const venue = partial.venue ?? { name: CFP, type: 'venue' }
  return {
    name: partial.key,
    slug: partial.key,
    description: '',
    featured: false,
    types: [{ title: 'Exhibition', slug: 'exhibition' }],
    ...partial,
    venue: { ...venue, rollUp: rollUpVenue(venue) },
  }
}

// Deliberately shuffled: Sanity hands back the editor's array order, so the
// derivation has to impose board order rather than trust the input.
const events = [
  ev({ key: 'thu-late', startDate: '2026-04-16', startTime: '19:00' }),
  ev({ key: 'run-b', startDate: '2026-04-12', endDate: '2026-04-30' }),
  ev({ key: 'thu-early', startDate: '2026-04-16', startTime: '10:00' }),
  ev({ key: 'run-a', startDate: '2026-04-10', endDate: '2026-04-30' }),
  ev({ key: 'wed', startDate: '2026-04-15' }),
]

// Board order: the Ongoing runs by start date, then the day-by-day agenda.
const ORDER = ['run-a', 'run-b', 'wed', 'thu-early', 'thu-late']

describe('eventSteps', () => {
  it('walks the whole programme in board order', () => {
    const walked = ORDER.map((slug) => {
      const { prev, next } = eventSteps(events, slug, 2026)
      return [prev?.name, next?.name]
    })

    expect(walked).toEqual([
      [undefined, 'run-b'],
      ['run-a', 'wed'],
      ['run-b', 'thu-early'],
      ['wed', 'thu-late'],
      ['thu-early', undefined],
    ])
  })

  it("reports this event's position in the full programme", () => {
    const positions = ORDER.map((slug) => {
      const { index, total } = eventSteps(events, slug, 2026)
      return [index, total]
    })

    expect(positions).toEqual([
      [0, 5],
      [1, 5],
      [2, 5],
      [3, 5],
      [4, 5],
    ])
  })

  it('builds hrefs on the event route', () => {
    expect(eventSteps(events, 'wed', 2026).next).toEqual({
      href: '/editions/2026/events/thu-early',
      name: 'thu-early',
    })
  })

  it('does not wrap at either end', () => {
    expect(eventSteps(events, ORDER[0] as string, 2026).prev).toBeUndefined()
    expect(eventSteps(events, ORDER.at(-1) as string, 2026).next).toBeUndefined()
  })

  it('returns no steps for a slug outside the edition', () => {
    expect(eventSteps(events, 'not-an-event', 2026)).toEqual({})
  })

  it('returns no steps for a lone event', () => {
    expect(eventSteps([ev({ key: 'only', startDate: '2026-04-15' })], 'only', 2026)).toEqual({
      prev: undefined,
      next: undefined,
      index: 0,
      total: 1,
    })
  })
})
