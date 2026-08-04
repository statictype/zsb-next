import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { EditionCard } from '@/components/EditionCard/EditionCard'

describe('EditionCard', () => {
  const edition = {
    year: 2026,
    theme: 'the weight of light',
    themeHighlight: 'light',
    dateSpan: '10–20 May',
    venueLine: 'Combinatul Fondului Plastic',
    artistCount: 44,
    eventCount: 13,
    heroImage: { src: '/img/hero.jpg', alt: 'Hero' },
    href: '/editions/2026',
  }

  it('is always a link to the edition page', () => {
    render(<EditionCard edition={edition} href="/editions/2026" />)

    expect(screen.getByRole('link')).toHaveAttribute('href', '/editions/2026')
  })

  it('leads with the prefixed year and demotes the theme beneath it', () => {
    render(<EditionCard edition={edition} href="/editions/2026" />)

    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('ZSB 2026')
    expect(
      screen.getByText((_, node) => node?.textContent === 'the weight of light'),
    ).toBeInTheDocument()
  })

  it('records the counts, the span and the venue', () => {
    render(<EditionCard edition={edition} href="/editions/2026" />)

    // The numerals are separate spans within the line, so match on the
    // combined text content rather than a single text node.
    expect(
      screen.getByText((_, node) => node?.textContent === '44 artists · 13 events'),
    ).toBeInTheDocument()
    expect(screen.getByText('10–20 May')).toBeInTheDocument()
    expect(screen.getByText('Combinatul Fondului Plastic')).toBeInTheDocument()
  })

  it('still renders a plate when the edition has no image at all', () => {
    const { heroImage: _hero, ...imageless } = edition

    render(<EditionCard edition={imageless} href="/editions/2026" />)

    expect(screen.getByRole('link')).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('ZSB 2026')
  })

  it('drops a count that is zero and singularises a count of one', () => {
    render(
      <EditionCard edition={{ ...edition, artistCount: 1, eventCount: 0 }} href="/editions/2026" />,
    )

    expect(screen.getByText((_, node) => node?.textContent === '1 artist')).toBeInTheDocument()
    expect(screen.queryByText(/event/)).not.toBeInTheDocument()
  })
})
