import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { EditionCard } from '@/components/EditionCard/EditionCard'

describe('EditionCard', () => {
  const edition = {
    year: 2026,
    theme: 'the weight of light',
    themeHighlight: 'light',
    themeBody: 'A longer statement about the theme.',
    dateSpan: '10–20 May',
    artistCount: 44,
    eventCount: 13,
    heroImage: { src: '/img/hero.jpg', alt: 'Hero' },
    href: '/editions/2026',
  }

  it('links the year block and the button to the edition page', () => {
    render(<EditionCard edition={edition} href="/editions/2026" />)

    expect(screen.getByRole('link', { name: /ZSB 2026/ })).toHaveAttribute('href', '/editions/2026')
    expect(screen.getByRole('link', { name: /View edition/ })).toHaveAttribute(
      'href',
      '/editions/2026',
    )
  })

  it('keeps the theme statement collapsed until the toggle is pressed', async () => {
    const user = userEvent.setup()
    render(<EditionCard edition={edition} href="/editions/2026" />)

    const toggle = screen.getByRole('button', { name: 'Read the theme' })
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
    expect(screen.getByText('A longer statement about the theme.')).toHaveAttribute(
      'data-open',
      'false',
    )

    await user.click(toggle)

    expect(screen.getByRole('button', { name: 'Hide the theme' })).toHaveAttribute(
      'aria-expanded',
      'true',
    )
    expect(screen.getByText('A longer statement about the theme.')).toHaveAttribute(
      'data-open',
      'true',
    )
  })

  it('leads with the prefixed year and demotes the theme beneath it', () => {
    render(<EditionCard edition={edition} href="/editions/2026" />)

    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('ZSB 2026')
    expect(
      screen.getByText((_, node) => node?.textContent === 'the weight of light'),
    ).toBeInTheDocument()
  })

  it('runs the date span and the counts on one line', () => {
    render(<EditionCard edition={edition} href="/editions/2026" />)

    // The numerals are separate spans within the line, so match on the
    // combined text content rather than a single text node.
    expect(
      screen.getByText((_, node) => node?.textContent === '10–20 May · 44 artists · 13 events'),
    ).toBeInTheDocument()
  })

  it('slots a venue line between the date span and the counts when one is set', () => {
    render(<EditionCard edition={{ ...edition, venueLine: 'Online' }} href="/editions/2026" />)

    expect(
      screen.getByText(
        (_, node) => node?.textContent === '10–20 May · Online · 44 artists · 13 events',
      ),
    ).toBeInTheDocument()
  })

  it('drops the separator when the edition has no date span', () => {
    render(<EditionCard edition={{ ...edition, dateSpan: '' }} href="/editions/2026" />)

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

  it('drops a count that is zero and singularises a count of one', () => {
    render(
      <EditionCard edition={{ ...edition, artistCount: 1, eventCount: 0 }} href="/editions/2026" />,
    )

    expect(
      screen.getByText((_, node) => node?.textContent === '10–20 May · 1 artist'),
    ).toBeInTheDocument()
    expect(screen.queryByText(/event/)).not.toBeInTheDocument()
  })
})
