import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { Accordion } from '@/components/ui/Accordion/Accordion'

const items = [
  { id: 'one', trigger: 'First question', triggerHeading: 'h3' as const, content: 'First answer' },
  { id: 'two', trigger: 'Second question', content: 'Second answer' },
]

describe('Accordion', () => {
  it('keeps collapsed content mounted and permits at most one open item by default', async () => {
    const user = userEvent.setup()
    render(<Accordion items={items} />)

    expect(screen.getByText('First answer')).toBeInTheDocument()
    expect(screen.getByText('Second answer')).toBeInTheDocument()

    const first = screen.getByRole('button', { name: 'First question' })
    const second = screen.getByRole('button', { name: 'Second question' })
    expect(screen.getByRole('heading', { level: 3, name: 'First question' })).toContainElement(
      first,
    )
    expect(first).toHaveAttribute('aria-expanded', 'false')
    expect(second).toHaveAttribute('aria-expanded', 'false')

    await user.click(first)
    expect(first).toHaveAttribute('aria-expanded', 'true')

    await user.click(second)
    expect(first).toHaveAttribute('aria-expanded', 'false')
    expect(second).toHaveAttribute('aria-expanded', 'true')
  })

  it('allows independent open items only when multiple is explicit', async () => {
    const user = userEvent.setup()
    render(<Accordion items={items} multiple />)

    const first = screen.getByRole('button', { name: 'First question' })
    const second = screen.getByRole('button', { name: 'Second question' })
    await user.click(first)
    await user.click(second)

    expect(first).toHaveAttribute('aria-expanded', 'true')
    expect(second).toHaveAttribute('aria-expanded', 'true')
  })
})
