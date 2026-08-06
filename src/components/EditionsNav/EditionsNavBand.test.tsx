import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { EditionsNavBandList } from '@/components/EditionsNav/EditionsNavBand'

const editions = [
  { year: 2027, theme: 'open field', themeHighlight: 'field' },
  { year: 2026, theme: 'the weight of light', themeHighlight: 'light', href: '/editions/2026' },
  { year: 2025, theme: 'soft ground', themeHighlight: 'ground', href: '/editions/2025' },
]

const cell = (year: number) => screen.getByRole('link', { name: new RegExp(`ZSB ${year}`) })

describe('EditionsNavBandList', () => {
  it('names the landmark and keeps the prefix off the year', () => {
    render(<EditionsNavBandList editions={editions} pathname="/about" />)

    expect(screen.getByRole('navigation', { name: 'Editions' })).toBeInTheDocument()
    expect(cell(2026)).toHaveTextContent('ZSB 2026')
    expect(screen.queryByText('Viewing')).toBeNull()
  })

  it('marks the edition being viewed', () => {
    render(<EditionsNavBandList editions={editions} pathname="/editions/2026" />)

    expect(cell(2026)).toHaveAttribute('aria-current', 'page')
    expect(cell(2026)).toHaveTextContent('Viewing')
    expect(cell(2025)).not.toHaveAttribute('aria-current')
  })

  it('keeps the edition marked while one of its events is open over it', () => {
    render(
      <EditionsNavBandList editions={editions} pathname="/editions/2026/events/open-studios" />,
    )

    expect(cell(2026)).toHaveTextContent('Viewing')
    // The event is the page, the edition is not.
    expect(cell(2026)).not.toHaveAttribute('aria-current')
  })

  it('renders without current state when the pathname is unknown', () => {
    render(<EditionsNavBandList editions={editions} pathname={null} />)

    expect(screen.getAllByRole('link')).toHaveLength(2)
    expect(screen.queryByText('Viewing')).toBeNull()
  })

  it('renders announced editions as inert "Soon" cells', () => {
    render(<EditionsNavBandList editions={editions} pathname="/editions/2026" />)

    expect(screen.getByText('Soon')).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /ZSB 2027/ })).toBeNull()
    // The highlight substring is still wrapped in its own span.
    expect(screen.getByText('field')).toBeInTheDocument()
  })
})
