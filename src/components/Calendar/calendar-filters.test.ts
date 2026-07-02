import { describe, expect, it } from 'vitest'
import { rollUpVenue } from '@/lib/venues'
import type { CalendarEvent, EventVenue } from '@/types/edition'
import {
  applyFilters,
  computeFilterOptions,
  DEFAULT_FILTERS,
  hasActiveFilters,
  hasPastEvents,
  hasUpcomingEvents,
  resolveShowPast,
} from './calendar-filters'

const CFP = 'Combinatul Fondului Plastic'

// Minimal event factory — only the fields the filter logic touches. The venue's
// rolled-up identity is stamped with the real rule so the filter/match tests
// run against production-shaped data (ZSB-65).
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

describe('hasUpcomingEvents / hasPastEvents', () => {
  const events = [
    ev({ key: 'past', startDate: '2026-04-10' }),
    ev({ key: 'future', startDate: '2026-04-20' }),
  ]
  it('detects upcoming and past presence against today', () => {
    expect(hasUpcomingEvents(events, '2026-04-15')).toBe(true)
    expect(hasPastEvents(events, '2026-04-15')).toBe(true)
    expect(hasUpcomingEvents(events, '2026-05-01')).toBe(false)
    expect(hasPastEvents(events, '2026-04-01')).toBe(false)
  })
})

describe('resolveShowPast', () => {
  const mixed = [
    ev({ key: 'past', startDate: '2026-04-10' }),
    ev({ key: 'future', startDate: '2026-04-20' }),
  ]
  it('shows everything before the client clock resolves', () => {
    expect(resolveShowPast(DEFAULT_FILTERS, mixed, null)).toBe(true)
  })
  it('hides past by default on a live edition (has upcoming)', () => {
    expect(resolveShowPast(DEFAULT_FILTERS, mixed, '2026-04-15')).toBe(false)
  })
  it('shows past by default on a finished edition (nothing upcoming)', () => {
    expect(resolveShowPast(DEFAULT_FILTERS, mixed, '2026-05-01')).toBe(true)
  })
  it('honours an explicit choice over the default', () => {
    expect(resolveShowPast({ ...DEFAULT_FILTERS, showPast: true }, mixed, '2026-04-15')).toBe(true)
    expect(resolveShowPast({ ...DEFAULT_FILTERS, showPast: false }, mixed, '2026-05-01')).toBe(
      false,
    )
  })
})

describe('computeFilterOptions', () => {
  it('rolls sub-venues into their parent and counts events under the parent', () => {
    const events = [
      ev({ key: 'a', startDate: '2026-04-10', venue: { name: CFP, type: 'venue' } }),
      ev({
        key: 'b',
        startDate: '2026-04-11',
        venue: { name: 'UNAgaleria', type: 'venue', partOf: { name: CFP, type: 'Partner venue' } },
      }),
      ev({
        key: 'c',
        startDate: '2026-04-12',
        venue: {
          name: 'Ana Zoe Pop Studio',
          type: 'venue',
          partOf: { name: CFP, type: 'Partner venue' },
        },
      }),
      ev({ key: 'd', startDate: '2026-04-13', venue: { name: 'Galeria Simeza', type: 'venue' } }),
    ]
    const { venues } = computeFilterOptions(events)
    expect(venues).toEqual([
      { slug: 'combinatul-fondului-plastic', label: CFP, count: 3 },
      { slug: 'galeria-simeza', label: 'Galeria Simeza', count: 1 },
    ])
  })

  it('counts an event under each of its types, ordered by count then label', () => {
    const events = [
      ev({
        key: 'a',
        startDate: '2026-04-10',
        types: [
          { title: 'Exhibition', slug: 'exhibition' },
          { title: 'Opening', slug: 'opening' },
        ],
      }),
      ev({ key: 'b', startDate: '2026-04-11', types: [{ title: 'Opening', slug: 'opening' }] }),
    ]
    const { types } = computeFilterOptions(events)
    expect(types).toEqual([
      { slug: 'opening', label: 'Opening', count: 2 },
      { slug: 'exhibition', label: 'Exhibition', count: 1 },
    ])
  })
})

describe('applyFilters', () => {
  const events = [
    ev({
      key: 'cfp-ex',
      startDate: '2026-04-20',
      venue: { name: CFP, type: 'venue' },
      types: [{ title: 'Exhibition', slug: 'exhibition' }],
    }),
    ev({
      key: 'una-talk',
      startDate: '2026-04-21',
      venue: { name: 'UNAgaleria', type: 'venue', partOf: { name: CFP, type: 'Partner venue' } },
      types: [{ title: 'Talk', slug: 'talk' }],
    }),
    ev({
      key: 'simeza-ex',
      startDate: '2026-04-22',
      venue: { name: 'Galeria Simeza', type: 'venue' },
      types: [
        { title: 'Exhibition', slug: 'exhibition' },
        { title: 'Talk', slug: 'talk' },
      ],
    }),
  ]

  it('imposes no constraint when a filter is null (all selected)', () => {
    expect(applyFilters(events, DEFAULT_FILTERS, '2026-04-01')).toHaveLength(3)
  })

  it('matches sub-venues through their parent slug', () => {
    const out = applyFilters(
      events,
      { ...DEFAULT_FILTERS, venues: ['combinatul-fondului-plastic'] },
      '2026-04-01',
    )
    expect(out.map((e) => e.key)).toEqual(['cfp-ex', 'una-talk'])
  })

  it('shows nothing when a filter is empty (none selected)', () => {
    expect(applyFilters(events, { ...DEFAULT_FILTERS, venues: [] }, '2026-04-01')).toHaveLength(0)
  })

  it('OR-combines within the type filter, matching any of an event’s types', () => {
    const out = applyFilters(events, { ...DEFAULT_FILTERS, types: ['talk'] }, '2026-04-01')
    expect(out.map((e) => e.key)).toEqual(['una-talk', 'simeza-ex'])
  })

  it('AND-combines across filters', () => {
    const out = applyFilters(
      events,
      { ...DEFAULT_FILTERS, venues: ['galeria-simeza'], types: ['exhibition'] },
      '2026-04-01',
    )
    expect(out.map((e) => e.key)).toEqual(['simeza-ex'])
  })

  it('hides past events by default on a live edition, reveals them when asked', () => {
    const mixed = [
      ev({ key: 'past', startDate: '2026-04-10' }),
      ev({ key: 'future', startDate: '2026-04-20' }),
    ]
    expect(applyFilters(mixed, DEFAULT_FILTERS, '2026-04-15').map((e) => e.key)).toEqual(['future'])
    expect(
      applyFilters(mixed, { ...DEFAULT_FILTERS, showPast: true }, '2026-04-15').map((e) => e.key),
    ).toEqual(['past', 'future'])
  })

  it('never hides anything before the clock resolves', () => {
    const mixed = [
      ev({ key: 'past', startDate: '2026-04-10' }),
      ev({ key: 'future', startDate: '2026-04-20' }),
    ]
    expect(applyFilters(mixed, DEFAULT_FILTERS, null)).toHaveLength(2)
  })
})

describe('hasActiveFilters', () => {
  it('is false at the default and true on any deviation', () => {
    expect(hasActiveFilters(DEFAULT_FILTERS)).toBe(false)
    expect(hasActiveFilters({ ...DEFAULT_FILTERS, venues: ['cfp'] })).toBe(true)
    expect(hasActiveFilters({ ...DEFAULT_FILTERS, venues: [] })).toBe(true)
    expect(hasActiveFilters({ ...DEFAULT_FILTERS, showPast: true })).toBe(true)
  })
})
