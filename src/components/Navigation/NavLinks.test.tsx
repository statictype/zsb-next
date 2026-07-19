import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { NavLinksList } from '@/components/Navigation/NavLinks'

describe('NavLinksList', () => {
  it('uses aria-current only for exact page matches', () => {
    render(<NavLinksList pathname="/editions" className="nav-link" context="desktop" />)

    const editions = screen.getByRole('link', { name: 'Editions' })
    expect(editions).toHaveAttribute('aria-current', 'page')
    expect(editions).toHaveAttribute('data-active', 'true')
  })

  it('keeps section descendants visually active without claiming the current page', () => {
    render(<NavLinksList pathname="/editions/2026" className="nav-link" context="desktop" />)

    const editions = screen.getByRole('link', { name: 'Editions' })
    expect(editions).not.toHaveAttribute('aria-current')
    expect(editions).toHaveAttribute('data-active', 'true')
  })
})
