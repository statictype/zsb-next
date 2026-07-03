import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { EditionCard } from './EditionCard'

describe('EditionCard', () => {
  const edition = {
    year: 2026,
    theme: 'the weight of light',
    themeHighlight: 'light',
    dateTape: '10–20 May 2026 · Combinatul Fondului Plastic',
    artists: Array.from({ length: 37 }, (_, i) => `Artist ${i}`),
    venueLine: 'Combinatul Fondului Plastic',
    heroImage: { src: '/img/hero.jpg', alt: 'Hero' },
  }

  it('renders the meta row from the edition slice', () => {
    render(<EditionCard edition={edition} href="/editions/2026" />)

    // Date is the tape's first segment, before the " · " separator.
    expect(screen.getByText('10–20 May 2026')).toBeInTheDocument()
    expect(screen.getByText('37 artists')).toBeInTheDocument()
    expect(screen.getByText('Combinatul Fondului Plastic')).toBeInTheDocument()
  })

  it('singularises a one-artist count', () => {
    render(<EditionCard edition={{ ...edition, artists: ['Solo'] }} href="/editions/2026" />)

    expect(screen.getByText('1 artist')).toBeInTheDocument()
  })

  it('is always a link to the edition page', () => {
    render(<EditionCard edition={edition} href="/editions/2026" />)

    expect(screen.getByRole('link')).toHaveAttribute('href', '/editions/2026')
  })
})
