import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { Collapsible } from '@/components/ui/Collapsible/Collapsible'

describe('Collapsible', () => {
  it('starts closed, keeps archive content mounted, and exposes both state labels', async () => {
    const user = userEvent.setup()
    const { container } = render(
      <Collapsible
        closedLabel="View full programme"
        openLabel="Hide full programme"
        meta="3 events"
      >
        <p>Archived programme</p>
      </Collapsible>,
    )

    const trigger = screen.getByRole('button')
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    expect(container.querySelector('[data-collapsible-label="closed"]')).toHaveTextContent(
      'View full programme',
    )
    expect(container.querySelector('[data-collapsible-label="open"]')).toHaveTextContent(
      'Hide full programme',
    )
    expect(screen.getByText('Archived programme')).toBeInTheDocument()

    await user.click(trigger)
    expect(trigger).toHaveAttribute('aria-expanded', 'true')
  })
})
