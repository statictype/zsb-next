import { ArchiveCollapse, CalendarBoard, EventRow } from '@calendar/CalendarBoard'
import { CalendarRecap } from '@calendar/CalendarRecap'
import { DEFAULT_FILTERS, deriveCalendarView } from '@calendar/calendar-filters'
import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { rollUpVenue } from '@/lib/venues'
import type { CalendarEvent, EventVenue } from '@/types/edition'

// Same production-shaped event factory as calendar-filters.test.ts: only the
// fields the board renders, the venue rollup stamped with the real rule.
function ev(
  partial: Partial<Omit<CalendarEvent, 'venue'>> &
    Pick<CalendarEvent, 'key' | 'startDate'> & { venue?: Omit<EventVenue, 'rollUp'> },
): CalendarEvent {
  const venue = partial.venue ?? { name: 'CFP', type: 'venue' }
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

const view = (events: CalendarEvent[], todayIso: string | null = null) =>
  deriveCalendarView(events, DEFAULT_FILTERS, todayIso)

describe('CalendarBoard — empty state', () => {
  it('renders the no-match notice and resets from it', () => {
    const onReset = vi.fn()
    const empty = deriveCalendarView(
      [ev({ key: 'a', startDate: '2026-04-20' })],
      { ...DEFAULT_FILTERS, venues: [] },
      null,
    )
    render(<CalendarBoard view={empty} year={2026} onReset={onReset} />)

    expect(screen.getByRole('status')).toHaveTextContent('No events match these filters.')
    fireEvent.click(screen.getByRole('button', { name: 'Show all events' }))
    expect(onReset).toHaveBeenCalledOnce()
  })
})

describe('CalendarBoard — Ongoing + agenda composition', () => {
  const events = [
    ev({ key: 'run', startDate: '2026-04-10', endDate: '2026-05-11' }),
    ev({ key: 'talk', startDate: '2026-04-20', startTime: '18:00' }),
    ev({ key: 'tour', startDate: '2026-04-21' }),
  ]

  it('splits multi-day runs into the Ongoing band, one-offs into the agenda', () => {
    render(<CalendarBoard view={view(events)} year={2026} onReset={() => {}} />)

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
    const { container } = render(
      <CalendarBoard
        view={deriveCalendarView(events, { ...DEFAULT_FILTERS, showPast: true }, '2026-04-21')}
        year={2026}
        onReset={() => {}}
      />,
    )
    const days = [...container.querySelectorAll('ol li[data-past]')]
    expect(days.map((d) => d.getAttribute('data-past'))).toEqual(['true', 'false'])
  })

  it('never greys on a finished edition — the clean-archive view', () => {
    const { container } = render(
      <CalendarBoard view={view(events, '2026-06-01')} year={2026} onReset={() => {}} />,
    )
    expect(container.querySelector('[data-past="true"]')).toBeNull()
  })
})

describe('ArchiveCollapse', () => {
  it('renders children directly while the edition is live', () => {
    render(
      <ArchiveCollapse ended={false} count={3}>
        <p>board</p>
      </ArchiveCollapse>,
    )
    expect(screen.getByText('board')).toBeInTheDocument()
    expect(screen.queryByRole('button')).toBeNull()
  })

  it('folds a finished edition behind the programme toggle with the event count', () => {
    render(
      <ArchiveCollapse ended={true} count={3}>
        <p>board</p>
      </ArchiveCollapse>,
    )
    expect(screen.getByRole('button', { name: /View full programme/ })).toBeInTheDocument()
    expect(screen.getByText('3 events')).toBeInTheDocument()
  })
})

describe('CalendarRecap', () => {
  it('names the finished edition with its theme and the follow CTAs', () => {
    render(
      <CalendarRecap
        year={2025}
        theme="the weight of light"
        socials={[{ label: 'Instagram', href: 'https://instagram.com/x' }]}
      />,
    )
    expect(
      screen.getByText(
        (_, node) => node?.textContent === 'That was ZSB 2025 — the weight of light.',
        {
          selector: 'p',
        },
      ),
    ).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Instagram' })).toHaveAttribute(
      'href',
      'https://instagram.com/x',
    )
  })

  it('drops the theme clause and CTAs when absent', () => {
    render(<CalendarRecap year={2025} theme={undefined} socials={[]} />)
    expect(
      screen.getByText((_, node) => node?.textContent === 'That was ZSB 2025.', { selector: 'p' }),
    ).toBeInTheDocument()
    expect(screen.queryByRole('link')).toBeNull()
  })
})

describe('EventRow', () => {
  it('links the event name to its route and tags a poster', () => {
    const event = ev({
      key: 'vernissage',
      startDate: '2026-04-20',
      startTime: '19:00',
      description: 'Opening drinks',
      image: { src: '/img/poster.jpg', alt: 'Poster' },
    })
    render(<EventRow event={event} year={2026} />)

    expect(screen.getByRole('link', { name: 'vernissage' })).toHaveAttribute(
      'href',
      '/editions/2026/events/vernissage',
    )
    expect(screen.getByText('19:00')).toBeInTheDocument()
    expect(screen.getByText('Poster')).toBeInTheDocument()
    expect(screen.getByText('Opening drinks')).toBeInTheDocument()
  })
})
