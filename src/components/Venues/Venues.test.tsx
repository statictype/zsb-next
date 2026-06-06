import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import type { VenueEntry } from '@/types/edition'
import { Venues } from './Venues'

const VENUES: VenueEntry[] = [
  {
    group: 'Combinatul Fondului Plastic',
    subgroup: 'Main Hall',
    name: 'Studio A',
    program: 'Exhibition',
  },
  {
    group: 'Combinatul Fondului Plastic',
    subgroup: 'Main Hall',
    name: 'Studio B',
    program: 'Talks',
  },
  { group: 'Partner Venues', subgroup: '', name: 'Gallery X', program: 'Film Program' },
]

describe('Venues', () => {
  it('renders one accordion trigger per distinct group', () => {
    render(<Venues venues={VENUES} />)
    const triggers = screen.getAllByRole('button')
    expect(triggers).toHaveLength(2)
    expect(screen.getByRole('button', { name: /Combinatul Fondului Plastic/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Partner Venues/ })).toBeInTheDocument()
  })

  it('numbers venues continuously across groups', () => {
    render(<Venues venues={VENUES} />)
    // displayNumber increments across the whole list, zero-padded by padNum.
    expect(screen.getByText('01')).toBeInTheDocument()
    expect(screen.getByText('02')).toBeInTheDocument()
    expect(screen.getByText('03')).toBeInTheDocument()
    // Studio A is the first entry → 01; Gallery X is in the second group → 03.
    expect(within(screen.getByText('Studio A').closest('div')!).getByText('01')).toBeInTheDocument()
    expect(
      within(screen.getByText('Gallery X').closest('div')!).getByText('03'),
    ).toBeInTheDocument()
  })

  it('toggles a group open and closed via aria-expanded', async () => {
    const user = userEvent.setup()
    render(<Venues venues={VENUES} />)
    const trigger = screen.getByRole('button', { name: /Combinatul Fondului Plastic/ })

    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    await user.click(trigger)
    expect(trigger).toHaveAttribute('aria-expanded', 'true')
    await user.click(trigger)
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
  })

  it('opens groups independently', async () => {
    const user = userEvent.setup()
    render(<Venues venues={VENUES} />)
    const first = screen.getByRole('button', { name: /Combinatul Fondului Plastic/ })
    const second = screen.getByRole('button', { name: /Partner Venues/ })

    await user.click(first)
    expect(first).toHaveAttribute('aria-expanded', 'true')
    expect(second).toHaveAttribute('aria-expanded', 'false')
  })
})
