import { FinishedProgram, LiveProgram } from '@program/Program'
import { EventRow, ProgramBoard } from '@program/ProgramBoard'
import { ProgramProvider } from '@program/ProgramContext'
import { currentUrl, resetFakes } from '@program/program-fakes'
import { fireEvent, render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { rollUpVenue } from '@/lib/venues'
import type { CalendarEvent, EventVenue } from '@/types/edition'

vi.mock('next/navigation', async () => (await import('@program/program-fakes')).fakeNavigation())
vi.mock('@/lib/use-today-iso', async () => (await import('@program/program-fakes')).fakeClock())

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

function renderInProgram(
  ui: ReactNode,
  {
    events,
    search = '',
    today = null,
  }: { events: CalendarEvent[]; search?: string; today?: string | null },
) {
  resetFakes({ search, today })
  return render(
    <ProgramProvider year={2026} events={events}>
      {ui}
    </ProgramProvider>,
  )
}

beforeEach(() => resetFakes({}))

describe('ProgramBoard — empty state', () => {
  it('renders the no-match notice and resets from it', () => {
    renderInProgram(<ProgramBoard />, {
      events: [ev({ key: 'a', startDate: '2026-04-20' })],
      search: 'venue=',
    })

    expect(screen.getByRole('status')).toHaveTextContent('No events match these filters.')
    fireEvent.click(screen.getByRole('button', { name: 'Show all events' }))
    expect(currentUrl()).toBe('/editions/2026')
    expect(screen.getByRole('link', { name: 'a' })).toBeInTheDocument()
  })
})

describe('ProgramBoard — Ongoing + day-by-day composition', () => {
  const events = [
    ev({ key: 'run', startDate: '2026-04-10', endDate: '2026-05-11' }),
    ev({ key: 'talk', startDate: '2026-04-20', startTime: '18:00' }),
    ev({ key: 'tour', startDate: '2026-04-21' }),
  ]

  it('splits multi-day runs into the Ongoing band, one-offs into the day-by-day list', () => {
    renderInProgram(<ProgramBoard />, { events })

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
    const { container } = renderInProgram(<ProgramBoard />, {
      events,
      search: 'past=1',
      today: '2026-04-21',
    })
    const days = [...container.querySelectorAll('ol li[data-past]')]
    expect(days.map((d) => d.getAttribute('data-past'))).toEqual(['true', 'false'])
  })

  it('never greys on a finished edition — the clean-archive view', () => {
    const { container } = renderInProgram(<ProgramBoard />, { events, today: '2026-06-01' })
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
    renderInProgram(<FinishedProgram />, { events, today: '2026-06-01' })

    expect(screen.getByRole('button', { name: /Browse the full program/ })).toBeInTheDocument()
    expect(screen.getByText('3 events')).toBeInTheDocument()
  })

  it('shows the live board with its heading and no archive toggle', () => {
    renderInProgram(<LiveProgram />, { events })

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
    renderInProgram(<EventRow event={event} />, { events: [event] })

    expect(screen.getByRole('link', { name: 'vernissage' })).toHaveAttribute(
      'href',
      '/editions/2026/events/vernissage',
    )
    expect(screen.getByText('19:00')).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'Poster' })).toBeInTheDocument()
    expect(screen.getByText('Opening drinks')).toBeInTheDocument()
  })
})
