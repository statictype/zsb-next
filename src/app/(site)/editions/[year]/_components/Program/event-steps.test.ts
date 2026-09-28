import { eventSteps } from '@program/event-steps'
import { describe, expect, it } from 'vitest'
import { editionProgramScope } from '@/lib/edition-href'
import { bellerProgramScope } from '@/lib/galeria-beller-href'
import { rollUpVenue } from '@/lib/venues'
import type { CalendarEvent, EventVenue } from '@/types/edition'

const CFP = 'Combinatul Fondului Plastic'
const SCOPE = editionProgramScope(2026)

// Mirrors the factory in program-filters.test.ts — only the fields the step
// derivation touches, with the venue stamped by the real roll-up rule.
function ev(
  partial: Partial<Omit<CalendarEvent, 'venue'>> &
    Pick<CalendarEvent, 'key' | 'startDate'> & { venue?: Omit<EventVenue, 'rollUp'> },
): CalendarEvent {
  const venue = partial.venue ?? { name: CFP }
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

// Board order: the Ongoing runs by start date, then the day-by-day list.
const ORDER = ['run-a', 'run-b', 'wed', 'thu-early', 'thu-late']

describe('eventSteps', () => {
  it('walks the whole program in board order', () => {
    const walked = ORDER.map((slug) => {
      const { prev, next } = eventSteps(events, slug, SCOPE)
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

  it("reports this event's position in the full program", () => {
    const positions = ORDER.map((slug) => {
      const { index, total } = eventSteps(events, slug, SCOPE)
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
    expect(eventSteps(events, 'wed', SCOPE).next).toEqual({
      slug: 'thu-early',
      href: '/editions/2026/events/thu-early',
      name: 'thu-early',
    })
  })

  it('does not wrap at either end', () => {
    expect(eventSteps(events, ORDER[0] as string, SCOPE).prev).toBeUndefined()
    expect(eventSteps(events, ORDER.at(-1) as string, SCOPE).next).toBeUndefined()
  })

  it('returns no steps for a slug outside the edition', () => {
    expect(eventSteps(events, 'not-an-event', SCOPE)).toEqual({})
  })

  it('returns no steps for a lone event', () => {
    expect(eventSteps([ev({ key: 'only', startDate: '2026-04-15' })], 'only', SCOPE)).toEqual({
      prev: undefined,
      next: undefined,
      index: 0,
      total: 1,
    })
  })

  it('builds hrefs from the scope', () => {
    const { next } = eventSteps(events, 'run-a', bellerProgramScope)
    expect(next?.href).toBe('/galeria-beller/evenimente/run-b')
  })
})
