import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { ReadMore } from './ReadMore'

describe('ReadMore', () => {
  it('starts collapsed with a "Read more" trigger', () => {
    render(<ReadMore>Hidden prose</ReadMore>)
    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('aria-expanded', 'false')
    expect(button).toHaveTextContent('Read more')
  })

  it('toggles label and aria-expanded on click', async () => {
    const user = userEvent.setup()
    render(<ReadMore>Hidden prose</ReadMore>)
    const button = screen.getByRole('button')

    await user.click(button)
    expect(button).toHaveAttribute('aria-expanded', 'true')
    expect(button).toHaveTextContent('Show less')

    await user.click(button)
    expect(button).toHaveAttribute('aria-expanded', 'false')
    expect(button).toHaveTextContent('Read more')
  })

  it('always renders its children (collapse is visual, not unmount)', () => {
    render(<ReadMore>The full manifesto text.</ReadMore>)
    expect(screen.getByText('The full manifesto text.')).toBeInTheDocument()
  })
})
