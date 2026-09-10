import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { EditionCard } from '@/components/EditionCard/EditionCard'
import type { EditionCardData } from '@/types/edition'

describe('EditionCard', () => {
  const edition: EditionCardData = {
    year: 2026,
    theme: 'the weight of light',
    themeHighlight: 'light',
    themeBody: 'A longer statement about the theme.',
    facts: [
      { kind: 'dates', text: '10–20 May' },
      { kind: 'artists', count: 44 },
      { kind: 'events', count: 13 },
    ],
    heroImage: { src: '/img/hero.jpg', alt: 'Hero' },
    href: '/editions/2026',
  }

  it('links the year block to the edition page', () => {
    render(<EditionCard edition={edition} href="/editions/2026" />)

    expect(screen.getByRole('link', { name: /ZSB 2026/ })).toHaveAttribute('href', '/editions/2026')
  })

  it('renders the theme statement', () => {
    render(<EditionCard edition={edition} href="/editions/2026" />)

    expect(screen.getByText('A longer statement about the theme.')).toBeInTheDocument()
  })

  it('leads with the prefixed year and demotes the theme beneath it', () => {
    render(<EditionCard edition={edition} href="/editions/2026" />)

    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('ZSB 2026')
    expect(
      screen.getByText((_, node) => node?.textContent === 'the weight of light'),
    ).toBeInTheDocument()
  })

  it('runs the facts on one line', () => {
    render(<EditionCard edition={edition} href="/editions/2026" />)

    expect(
      screen.getByText((_, node) => node?.textContent === '10–20 May · 44 artists · 13 events'),
    ).toBeInTheDocument()
  })

  it('renders a venue fact in the position it is given', () => {
    const withVenue: EditionCardData = {
      ...edition,
      facts: [
        { kind: 'dates', text: '10–20 May' },
        { kind: 'venue', text: 'Online' },
        { kind: 'artists', count: 44 },
        { kind: 'events', count: 13 },
      ],
    }
    render(<EditionCard edition={withVenue} href="/editions/2026" />)

    expect(
      screen.getByText(
        (_, node) => node?.textContent === '10–20 May · Online · 44 artists · 13 events',
      ),
    ).toBeInTheDocument()
  })

  it('starts the line without a separator when the first fact is a count', () => {
    const countsOnly: EditionCardData = {
      ...edition,
      facts: [
        { kind: 'artists', count: 44 },
        { kind: 'events', count: 13 },
      ],
    }
    render(<EditionCard edition={countsOnly} href="/editions/2026" />)

    expect(
      screen.getByText((_, node) => node?.textContent === '44 artists · 13 events'),
    ).toBeInTheDocument()
  })

  it('still renders a plate when the edition has no image at all', () => {
    const { heroImage: _hero, ...imageless } = edition

    render(<EditionCard edition={imageless} href="/editions/2026" />)

    expect(screen.getByRole('link', { name: /ZSB 2026/ })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('ZSB 2026')
  })

  it('singularises a count of one', () => {
    const single: EditionCardData = {
      ...edition,
      facts: [
        { kind: 'dates', text: '10–20 May' },
        { kind: 'artists', count: 1 },
      ],
    }
    render(<EditionCard edition={single} href="/editions/2026" />)

    expect(
      screen.getByText((_, node) => node?.textContent === '10–20 May · 1 artist'),
    ).toBeInTheDocument()
  })
})
