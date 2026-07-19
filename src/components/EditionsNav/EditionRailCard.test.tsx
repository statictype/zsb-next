import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { EditionRailCard } from '@/components/EditionsNav/EditionRailCard'

// "Announced plates never link" is enforced at the type level (`RailPlacement`
// makes `href` unrepresentable on announced), so there is no runtime test for
// the href-on-announced case — it doesn't compile.
describe('EditionRailCard', () => {
  const edition = { year: 2026, theme: 'the weight of light', themeHighlight: 'light' }

  it('links live editions and renders the highlight span', () => {
    render(<EditionRailCard edition={edition} status="live" href="/editions/2026" />)

    expect(screen.getByRole('link')).toHaveAttribute('href', '/editions/2026')
    // The highlight substring is wrapped in its own span.
    expect(screen.getByText('light')).toBeInTheDocument()
  })

  it('stamps the year and status badges inside the tape heading', () => {
    render(<EditionRailCard edition={edition} status="current" href="/editions/2026" />)

    const year = screen.getByText('2026')
    const status = screen.getByText('Viewing')
    expect(year.parentElement).toBe(status.parentElement)
    // The lead lives inside the band, so it is part of the heading's name.
    expect(
      screen.getByRole('heading', { name: '2026 Viewing the weight of light' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('link')).toHaveAttribute('aria-current', 'page')
  })

  it('renders announced editions as inert "Soon" plates without the highlight', () => {
    render(<EditionRailCard edition={edition} status="announced" />)

    expect(screen.getByText('Soon')).toBeInTheDocument()
    expect(screen.queryByRole('link')).toBeNull()
    // Highlight suppressed: the theme is a single unsplit text node.
    expect(screen.queryByText('light')).toBeNull()
    expect(screen.getByRole('heading', { name: /the weight of light/ })).toBeInTheDocument()
  })
})
