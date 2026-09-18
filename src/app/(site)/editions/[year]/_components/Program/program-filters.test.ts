import {
  computeFilterOptions,
  DEFAULT_FILTERS,
  deriveProgramView,
  filterUrl,
  isSelected,
  parseFilters,
  toggleSelection,
} from '@program/program-filters'
import { describe, expect, it } from 'vitest'
import { rollUpVenue } from '@/lib/venues'
import type { CalendarEvent, EventVenue } from '@/types/edition'

const CFP = 'Combinatul Fondului Plastic'

// Minimal event factory — only the fields the filter logic touches. The venue's
// rolled-up identity is stamped with the real rule so the filter/match tests
// run against production-shaped data (ZSB-65).
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

describe('computeFilterOptions', () => {
  it('rolls sub-venues into their parent and counts events under the parent', () => {
    const events = [
      ev({ key: 'a', startDate: '2026-04-10', venue: { name: CFP } }),
      ev({
        key: 'b',
        startDate: '2026-04-11',
        venue: { name: 'UNAgaleria', partOf: { name: CFP } },
      }),
      ev({
        key: 'c',
        startDate: '2026-04-12',
        venue: { name: 'Ana Zoe Pop Studio', partOf: { name: CFP } },
      }),
      ev({ key: 'd', startDate: '2026-04-13', venue: { name: 'Galeria Simeza' } }),
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

describe('deriveProgramView — filtering', () => {
  const events = [
    ev({
      key: 'cfp-ex',
      startDate: '2026-04-20',
      venue: { name: CFP },
      types: [{ title: 'Exhibition', slug: 'exhibition' }],
    }),
    ev({
      key: 'una-talk',
      startDate: '2026-04-21',
      venue: { name: 'UNAgaleria', partOf: { name: CFP } },
      types: [{ title: 'Talk', slug: 'talk' }],
    }),
    ev({
      key: 'simeza-ex',
      startDate: '2026-04-22',
      venue: { name: 'Galeria Simeza' },
      types: [
        { title: 'Exhibition', slug: 'exhibition' },
        { title: 'Talk', slug: 'talk' },
      ],
    }),
  ]
  const keys = (view: ReturnType<typeof deriveProgramView>) => view.visible.map((e) => e.key)

  it('imposes no constraint when a filter is null (all selected)', () => {
    const view = deriveProgramView(events, DEFAULT_FILTERS, '2026-04-01')
    expect(view.visible).toHaveLength(3)
    expect(view.canReset).toBe(false)
  })

  it('matches sub-venues through their parent slug', () => {
    const view = deriveProgramView(
      events,
      { ...DEFAULT_FILTERS, venues: ['combinatul-fondului-plastic'] },
      '2026-04-01',
    )
    expect(keys(view)).toEqual(['cfp-ex', 'una-talk'])
    expect(view.canReset).toBe(true)
  })

  it('shows nothing when a filter is empty (none selected)', () => {
    const view = deriveProgramView(events, { ...DEFAULT_FILTERS, venues: [] }, '2026-04-01')
    expect(view.visible).toHaveLength(0)
    expect(view.canReset).toBe(true)
  })

  it('OR-combines within the type filter, matching any of an event’s types', () => {
    const view = deriveProgramView(events, { ...DEFAULT_FILTERS, types: ['talk'] }, '2026-04-01')
    expect(keys(view)).toEqual(['una-talk', 'simeza-ex'])
  })

  it('AND-combines across filters', () => {
    const view = deriveProgramView(
      events,
      { ...DEFAULT_FILTERS, venues: ['galeria-simeza'], types: ['exhibition'] },
      '2026-04-01',
    )
    expect(keys(view)).toEqual(['simeza-ex'])
  })
})

describe('deriveProgramView — past events', () => {
  const mixed = [
    ev({ key: 'past', startDate: '2026-04-10' }),
    ev({ key: 'future', startDate: '2026-04-20' }),
  ]
  const keys = (view: ReturnType<typeof deriveProgramView>) => view.visible.map((e) => e.key)

  it('hides past by default on a live edition and offers the control', () => {
    const view = deriveProgramView(mixed, DEFAULT_FILTERS, '2026-04-15')
    expect(view.showPast).toBe(false)
    expect(view.showPastControl).toBe(true)
    expect(keys(view)).toEqual(['future'])
    expect(view.past).toBe(1)
  })

  it('reveals past events when asked, and counts that as an active filter', () => {
    const view = deriveProgramView(mixed, { ...DEFAULT_FILTERS, showPast: true }, '2026-04-15')
    expect(view.showPast).toBe(true)
    expect(keys(view)).toEqual(['past', 'future'])
    expect(view.canReset).toBe(true)
  })

  it('shows past by default on a finished edition, with no control', () => {
    const view = deriveProgramView(mixed, DEFAULT_FILTERS, '2026-05-01')
    expect(view.showPast).toBe(true)
    expect(view.showPastControl).toBe(false)
    expect(keys(view)).toEqual(['past', 'future'])
  })

  it('honours an explicit hide on a finished edition', () => {
    const view = deriveProgramView(mixed, { ...DEFAULT_FILTERS, showPast: false }, '2026-05-01')
    expect(view.showPast).toBe(false)
    expect(view.visible).toHaveLength(0)
  })

  it('never hides anything before the clock resolves', () => {
    const view = deriveProgramView(mixed, DEFAULT_FILTERS, null)
    expect(view.showPast).toBe(true)
    expect(view.showPastControl).toBe(false)
    expect(view.visible).toHaveLength(2)
  })
})

describe('filter selection helpers', () => {
  it('treats null as all-selected', () => {
    expect(isSelected(null, 'cfp')).toBe(true)
    expect(isSelected(['cfp'], 'cfp')).toBe(true)
    expect(isSelected(['cfp'], 'simeza')).toBe(false)
    expect(isSelected([], 'cfp')).toBe(false)
  })

  it('toggles off from the all-selected default by expanding then removing', () => {
    expect(toggleSelection(null, 'a', ['a', 'b', 'c'])).toEqual(['b', 'c'])
  })

  it('collapses back to null once everything is reselected', () => {
    expect(toggleSelection(['b', 'c'], 'a', ['a', 'b', 'c'])).toBeNull()
  })

  it('reaches the none state by toggling off the last selected option', () => {
    expect(toggleSelection(['a'], 'a', ['a', 'b'])).toEqual([])
  })
})

describe('parseFilters', () => {
  it('reads an absent param as all-selected (null) and a present one as a selection', () => {
    expect(parseFilters('?venue=cfp,galeria&type=talk&past=1')).toEqual({
      venues: ['cfp', 'galeria'],
      types: ['talk'],
      showPast: true,
    })
    expect(parseFilters('')).toEqual(DEFAULT_FILTERS)
  })

  it('reads an empty param as the none selection', () => {
    expect(parseFilters('?venue=')).toEqual({ venues: [], types: null, showPast: null })
  })

  it('round-trips through the URL, including the none state', () => {
    const filters = { venues: ['cfp', 'galeria'], types: [], showPast: false }
    const url = filterUrl('/editions/2026', '', filters)
    expect(parseFilters(new URL(url, 'https://x.test').search)).toEqual(filters)
  })
})

describe('filterUrl', () => {
  const PATH = '/editions/2026'
  const ALL_VENUES = ['combinatul-fondului-plastic', 'galeria-simeza']

  it('produces the bare pathname at the default filters', () => {
    expect(filterUrl(PATH, '', DEFAULT_FILTERS)).toBe(PATH)
  })

  it('carries unrelated params through a venue toggle', () => {
    const next = {
      ...DEFAULT_FILTERS,
      venues: toggleSelection(null, 'galeria-simeza', ALL_VENUES),
    }
    expect(filterUrl(PATH, 'utm=fb', next)).toBe(
      '/editions/2026?utm=fb&venue=combinatul-fondului-plastic',
    )
  })

  it('collapses a reset to the bare pathname', () => {
    expect(filterUrl(PATH, 'venue=galeria-simeza&past=1', DEFAULT_FILTERS)).toBe(PATH)
  })

  it('keeps unrelated params through a reset', () => {
    expect(filterUrl(PATH, 'utm=fb&venue=galeria-simeza', DEFAULT_FILTERS)).toBe(
      '/editions/2026?utm=fb',
    )
  })

  it('round-trips a toggle through the URL back to the same filters', () => {
    const next = {
      ...DEFAULT_FILTERS,
      venues: toggleSelection(null, 'galeria-simeza', ALL_VENUES),
      showPast: true,
    }
    const url = filterUrl(PATH, '', next)
    expect(parseFilters(new URL(url, 'https://x.test').search)).toEqual(next)
  })
})

describe('deriveProgramView — ended / past stamps / labels', () => {
  const mixed = [
    ev({ key: 'past', startDate: '2026-04-10', venue: { name: 'Galeria Simeza' } }),
    ev({ key: 'future', startDate: '2026-04-20', venue: { name: CFP } }),
  ]
  const run = ev({ key: 'run', startDate: '2026-04-01', endDate: '2026-04-12' })

  it('judges a live edition live and stamps past/today on days and runs', () => {
    const view = deriveProgramView(
      [...mixed, run],
      { ...DEFAULT_FILTERS, showPast: true },
      '2026-04-20',
    )
    expect(view.ended).toBe(false)
    expect(view.days.map((d) => [d.iso, d.past, d.today])).toEqual([
      ['2026-04-10', true, false],
      ['2026-04-20', false, true],
    ])
    expect(view.ongoing.map((r) => [r.event.key, r.past, r.range])).toEqual([
      ['run', true, '1–12 Apr'],
    ])
    expect(view.countLabel).toBe('1 upcoming event')
  })

  it('judges a finished edition ended, nothing stamped past, archive-total label', () => {
    const view = deriveProgramView([...mixed, run], DEFAULT_FILTERS, '2026-05-01')
    expect(view.ended).toBe(true)
    expect(view.days.every((d) => !d.past && !d.today)).toBe(true)
    expect(view.ongoing.every((r) => !r.past)).toBe(true)
    expect(view.countLabel).toBe('3 events')
  })

  it('judges ended/live on the whole edition — filtering to past-only keeps the live greying', () => {
    const view = deriveProgramView(
      mixed,
      { ...DEFAULT_FILTERS, venues: ['galeria-simeza'], showPast: true },
      '2026-04-15',
    )
    expect(view.visible.map((e) => e.key)).toEqual(['past'])
    expect(view.ended).toBe(false)
    expect(view.days.map((d) => d.past)).toEqual([true])
  })

  it('counts "X of Y" only when the venue/type filters narrow the upcoming set', () => {
    const twoUpcoming = [
      ev({ key: 'a', startDate: '2026-04-20', venue: { name: CFP } }),
      ev({ key: 'b', startDate: '2026-04-21', venue: { name: 'Galeria Simeza' } }),
    ]
    const all = deriveProgramView(twoUpcoming, DEFAULT_FILTERS, '2026-04-15')
    expect(all.countLabel).toBe('2 upcoming events')
    const narrowed = deriveProgramView(
      twoUpcoming,
      { ...DEFAULT_FILTERS, venues: ['galeria-simeza'] },
      '2026-04-15',
    )
    expect(narrowed.countLabel).toBe('1 of 2 upcoming events')
  })

  it('treats everything as upcoming before the clock resolves, no window judgement', () => {
    const view = deriveProgramView(mixed, DEFAULT_FILTERS, null)
    expect(view.ended).toBe(false)
    expect(view.days.every((d) => !d.past && !d.today)).toBe(true)
    expect(view.countLabel).toBe('2 upcoming events')
  })

  it('handles an eventless edition — zero-count label', () => {
    const view = deriveProgramView([], DEFAULT_FILTERS, '2026-04-15')
    expect(view.countLabel).toBe('0 events')
  })
})
