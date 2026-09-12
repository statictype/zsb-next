import { FinishedProgram, LiveProgram } from '@program/Program'
import { EventRow, ProgramBoard } from '@program/ProgramBoard'
import { ProgramContext, type ProgramContextValue } from '@program/ProgramContext'
import {
  computeFilterOptions,
  DEFAULT_FILTERS,
  deriveProgramView,
  type ProgramFilters,
} from '@program/program-filters'
import { fireEvent, render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { rollUpVenue } from '@/lib/venues'
import type { CalendarEvent, EventVenue } from '@/types/edition'

// Same production-shaped event factory as program-filters.test.ts: only the
// fields the board renders, the venue rollup stamped with the real rule.
function ev(
  partial: Partial<Omit<CalendarEvent, 'venue'>> &
    Pick<CalendarEvent, 'key' | 'startDate'> & { venue?: Omit<EventVenue, 'rollUp'> },
): CalendarEvent {
  const venue = partial.venue ?? { name: 'CFP' }
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

const noop = () => {}

function programValue({
  events,
  filters = DEFAULT_FILTERS,
  todayIso = null,
  reset = noop,
}: {
  events: CalendarEvent[]
  filters?: ProgramFilters
  todayIso?: string | null
  reset?: () => void
}): ProgramContextValue {
  return {
    state: {
      filters,
      filterOptions: computeFilterOptions(events),
      view: deriveProgramView(events, filters, todayIso),
      total: events.length,
    },
    actions: { toggleVenue: noop, toggleType: noop, setShowPast: noop, reset },
    meta: { year: 2026 },
  }
}

function renderInProgram(ui: ReactNode, value: ProgramContextValue) {
  return render(<ProgramContext value={value}>{ui}</ProgramContext>)
}

describe('ProgramBoard — empty state', () => {
  it('renders the no-match notice and resets from it', () => {
    const onReset = vi.fn()
    renderInProgram(
      <ProgramBoard />,
      programValue({
        events: [ev({ key: 'a', startDate: '2026-04-20' })],
        filters: { ...DEFAULT_FILTERS, venues: [] },
        reset: onReset,
      }),
    )

    expect(screen.getByRole('status')).toHaveTextContent('No events match these filters.')
    fireEvent.click(screen.getByRole('button', { name: 'Show all events' }))
    expect(onReset).toHaveBeenCalledOnce()
  })
})

describe('ProgramBoard — Ongoing + day-by-day composition', () => {
  const events = [
    ev({ key: 'run', startDate: '2026-04-10', endDate: '2026-05-11' }),
    ev({ key: 'talk', startDate: '2026-04-20', startTime: '18:00' }),
    ev({ key: 'tour', startDate: '2026-04-21' }),
  ]

  it('splits multi-day runs into the Ongoing band, one-offs into the day-by-day list', () => {
    renderInProgram(<ProgramBoard />, programValue({ events }))

    const ongoing = screen.getByRole('region', { name: 'Ongoing throughout the edition' })
    expect(ongoing).toHaveTextContent('run')
    expect(screen.getByRole('link', { name: 'run' })).toHaveAttribute(
      'href',
      '/editions/2026/events/run',
    )
    expect(screen.getByRole('link', { name: 'talk' })).toHaveAttribute(
      'href',
      '/editions/2026/events/talk',
    )
    expect(screen.getByText('18:00')).toBeInTheDocument()
  })

  it('greys past days against the live clock', () => {
    const { container } = renderInProgram(
      <ProgramBoard />,
      programValue({
        events,
        filters: { ...DEFAULT_FILTERS, showPast: true },
        todayIso: '2026-04-21',
      }),
    )
    const days = [...container.querySelectorAll('ol li[data-past]')]
    expect(days.map((d) => d.getAttribute('data-past'))).toEqual(['true', 'false'])
  })

  it('never greys on a finished edition — the clean-archive view', () => {
    const { container } = renderInProgram(
      <ProgramBoard />,
      programValue({ events, todayIso: '2026-06-01' }),
    )
    expect(container.querySelector('[data-past="true"]')).toBeNull()
  })
})

describe('Program — live and finished variants', () => {
  const events = [
    ev({ key: 'run', startDate: '2026-04-10', endDate: '2026-05-11' }),
    ev({ key: 'talk', startDate: '2026-04-20', startTime: '18:00' }),
    ev({ key: 'tour', startDate: '2026-04-21' }),
  ]

  it('folds a finished edition behind the program toggle with the event count', () => {
    renderInProgram(<FinishedProgram />, programValue({ events, todayIso: '2026-06-01' }))

    expect(screen.getByRole('button', { name: /Browse the full program/ })).toBeInTheDocument()
    expect(screen.getByText('3 events')).toBeInTheDocument()
  })

  it('shows the live board with its heading and no archive toggle', () => {
    renderInProgram(<LiveProgram />, programValue({ events }))

    expect(screen.getByRole('heading', { name: 'Program' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /Browse the full program/ })).toBeNull()
    expect(screen.getByRole('link', { name: 'talk' })).toBeInTheDocument()
  })
})

describe('EventRow', () => {
  it('links the event name to its route and renders its poster', () => {
    const event = ev({
      key: 'vernissage',
      startDate: '2026-04-20',
      startTime: '19:00',
      description: 'Opening drinks',
      image: { src: '/img/poster.jpg', alt: 'Poster' },
    })
    renderInProgram(<EventRow event={event} />, programValue({ events: [event] }))

    expect(screen.getByRole('link', { name: 'vernissage' })).toHaveAttribute(
      'href',
      '/editions/2026/events/vernissage',
    )
    expect(screen.getByText('19:00')).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'Poster' })).toBeInTheDocument()
    expect(screen.getByText('Opening drinks')).toBeInTheDocument()
  })
})
