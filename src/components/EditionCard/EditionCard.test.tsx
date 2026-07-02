import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { EditionCard } from './EditionCard'

describe('EditionCard', () => {
  const sampleEdition = {
    dateTape: '10–20 May 2026',
    artists: Array.from({ length: 37 }, (_, i) => `Artist ${i}`),
    venueLine: 'Combinatul Fondului Plastic',
  }

  it('renders archive edition details when image cards receive them', () => {
    render(
      <EditionCard year={2026} theme="the weight of light" edition={sampleEdition} media="image" />,
    )

    expect(screen.getByText('10–20 May 2026')).toBeInTheDocument()
    expect(screen.getByText('37 artists')).toBeInTheDocument()
    expect(screen.getByText('Combinatul Fondului Plastic')).toBeInTheDocument()
  })

  it('keeps imageless rail cards lean even when detail props are present', () => {
    render(
      <EditionCard
        year={2026}
        theme="the weight of light"
        edition={sampleEdition}
        media="none"
        size="sm"
      />,
    )

    expect(screen.queryByText('10–20 May 2026')).not.toBeInTheDocument()
    expect(screen.queryByText('37 artists')).not.toBeInTheDocument()
    expect(screen.queryByText('Combinatul Fondului Plastic')).not.toBeInTheDocument()
  })

  it('places rail status badges in the same theme row as the year', () => {
    render(
      <EditionCard
        year={2026}
        theme="the weight of light"
        status="current"
        media="none"
        size="sm"
      />,
    )

    const year = screen.getByText('2026')
    const status = screen.getByText('Viewing')
    expect(year.parentElement).toBe(status.parentElement)
  })

  it('never renders upcoming editions as links even when href is passed', () => {
    render(
      <EditionCard
        year={2026}
        theme="the weight of light"
        status="upcoming"
        media="none"
        size="sm"
        href="/editions/2026"
      />,
    )

    expect(screen.getByText('Soon')).toBeInTheDocument()
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
  })

  it('does not render the active highlight substring for upcoming editions', () => {
    render(
      <EditionCard
        year={2026}
        theme="the weight of light"
        themeHighlight="light"
        status="upcoming"
        media="none"
        size="sm"
      />,
    )

    const heading = screen.getByRole('heading', { name: 'the weight of light' })
    expect(heading.querySelector('span')).toBeNull()
  })
})
