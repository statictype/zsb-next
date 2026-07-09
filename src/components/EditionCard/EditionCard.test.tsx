import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { EditionCard } from './EditionCard'

describe('EditionCard', () => {
  const edition = {
    year: 2026,
    theme: 'the weight of light',
    themeHighlight: 'light',
    dateTape: '10–20 May 2026 · Combinatul Fondului Plastic',
    venueLine: 'Combinatul Fondului Plastic',
    heroImage: { src: '/img/hero.jpg', alt: 'Hero' },
  }

  it('renders the composed date/venue line', () => {
    render(<EditionCard edition={edition} href="/editions/2026" />)

    // The venue name is a separate nowrap span within the line, so match on
    // the combined text content rather than a single text node.
    expect(
      screen.getByText(
        (_, node) => node?.textContent === '10–20 May 2026 · Combinatul Fondului Plastic',
      ),
    ).toBeInTheDocument()
  })

  it('is always a link to the edition page', () => {
    render(<EditionCard edition={edition} href="/editions/2026" />)

    expect(screen.getByRole('link')).toHaveAttribute('href', '/editions/2026')
  })
})
