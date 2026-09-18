import { ProgramProvider, useProgram } from '@program/ProgramContext'
import { ProgramFilters } from '@program/ProgramFilters'
import { currentUrl, resetFakes } from '@program/program-fakes'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { rollUpVenue } from '@/lib/venues'
import type { CalendarEvent, EventVenue } from '@/types/edition'

vi.mock('next/navigation', async () => (await import('@program/program-fakes')).fakeNavigation())
vi.mock('@/lib/use-today-iso', async () => (await import('@program/program-fakes')).fakeClock())

const CFP = 'Combinatul Fondului Plastic'

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

const events = [
  ev({ key: 'past', startDate: '2026-04-10', venue: { name: 'Galeria Simeza' } }),
  ev({ key: 'cfp', startDate: '2026-04-20', venue: { name: CFP } }),
  ev({
    key: 'una',
    startDate: '2026-04-21',
    venue: { name: 'UNAgaleria', partOf: { name: CFP } },
    types: [{ title: 'Talk', slug: 'talk' }],
  }),
]

function Probe() {
  const { state, actions } = useProgram()
  return (
    <>
      <output data-testid="visible">{state.view.visible.map((e) => e.key).join(',')}</output>
      <output data-testid="count">{state.view.countLabel}</output>
      <output data-testid="total">{state.total}</output>
      <button type="button" onClick={() => actions.setShowPast(!state.view.showPast)}>
        toggle past
      </button>
      <button type="button" onClick={actions.reset}>
        reset
      </button>
    </>
  )
}

function renderProgram() {
  return render(
    <ProgramProvider year={2026} events={events}>
      <ProgramFilters />
      <Probe />
    </ProgramProvider>,
  )
}

beforeEach(() => resetFakes({}))

describe('ProgramProvider', () => {
  it('derives options and total from events and shows everything before the clock resolves', () => {
    renderProgram()
    expect(screen.getByRole('checkbox', { name: /Combinatul Fondului Plastic/ })).toBeChecked()
    expect(screen.getByRole('checkbox', { name: /Galeria Simeza/ })).toBeChecked()
    expect(screen.getByTestId('visible')).toHaveTextContent('past,cfp,una')
    expect(screen.getByTestId('total')).toHaveTextContent('3')
  })

  it('hides past events once the clock resolves on a live edition', () => {
    resetFakes({ today: '2026-04-15' })
    renderProgram()
    expect(screen.getByTestId('visible')).toHaveTextContent(/^cfp,una$/)
    expect(screen.getByTestId('count')).toHaveTextContent('2 upcoming events')
  })

  it('reads filters from the URL', () => {
    resetFakes({ today: '2026-04-15', search: 'type=talk' })
    renderProgram()
    expect(screen.getByTestId('visible')).toHaveTextContent(/^una$/)
    expect(screen.getByRole('checkbox', { name: /Talk/ })).toBeChecked()
    expect(screen.getByRole('checkbox', { name: /Exhibition/ })).not.toBeChecked()
  })

  it('writes a venue toggle to the URL and narrows the view through the parent venue', async () => {
    resetFakes({ today: '2026-04-15' })
    renderProgram()
    await userEvent.click(screen.getByRole('checkbox', { name: /Galeria Simeza/ }))
    expect(currentUrl()).toBe('/editions/2026?venue=combinatul-fondului-plastic')
    expect(screen.getByTestId('visible')).toHaveTextContent(/^cfp,una$/)
    expect(screen.getByTestId('count')).toHaveTextContent('2 upcoming events')
  })

  it('round-trips show-past and reset through the URL', async () => {
    resetFakes({ today: '2026-04-15' })
    renderProgram()
    await userEvent.click(screen.getByRole('button', { name: 'toggle past' }))
    expect(currentUrl()).toBe('/editions/2026?past=1')
    expect(screen.getByTestId('visible')).toHaveTextContent('past,cfp,una')
    await userEvent.click(screen.getByRole('button', { name: 'reset' }))
    expect(currentUrl()).toBe('/editions/2026')
    expect(screen.getByTestId('visible')).toHaveTextContent(/^cfp,una$/)
  })
})
