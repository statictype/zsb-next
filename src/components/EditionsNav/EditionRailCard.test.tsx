import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { EditionRailCard } from './EditionRailCard'

// "Upcoming plates never link" is enforced at the type level (`RailPlacement`
// makes `href` unrepresentable on upcoming), so there is no runtime test for
// the href-on-upcoming case — it doesn't compile.
describe('EditionRailCard', () => {
  const edition = { year: 2026, theme: 'the weight of light', themeHighlight: 'light' }

  it('links live editions and renders the highlight span', () => {
    render(<EditionRailCard edition={edition} status="live" href="/editions/2026" />)

    expect(screen.getByRole('link')).toHaveAttribute('href', '/editions/2026')
    const heading = screen.getByRole('heading', { name: 'the weight of light' })
    expect(heading.querySelector('span')).not.toBeNull()
  })

  it('stacks the year and status badges together and marks the current page', () => {
    render(<EditionRailCard edition={edition} status="current" href="/editions/2026" />)

    const year = screen.getByText('2026')
    const status = screen.getByText('Viewing')
    expect(year.parentElement).toBe(status.parentElement)
    expect(screen.getByRole('link')).toHaveAttribute('aria-current', 'page')
  })

  it('renders upcoming editions as inert "Soon" plates without the highlight', () => {
    render(<EditionRailCard edition={edition} status="upcoming" />)

    expect(screen.getByText('Soon')).toBeInTheDocument()
    expect(screen.queryByRole('link')).toBeNull()
    const heading = screen.getByRole('heading', { name: 'the weight of light' })
    expect(heading.querySelector('span')).toBeNull()
  })
})
