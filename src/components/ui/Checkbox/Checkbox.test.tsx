import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { Checkbox } from '@/components/ui/Checkbox/Checkbox'

describe('Checkbox', () => {
  it('translates Ark interaction into a controlled boolean callback', async () => {
    const user = userEvent.setup()
    const changes = vi.fn()

    function ControlledCheckbox() {
      const [checked, setChecked] = useState(false)
      return (
        <Checkbox
          id="sculpture"
          label="Sculpture"
          count={3}
          checked={checked}
          onCheckedChange={(next) => {
            changes(next)
            setChecked(next)
          }}
        />
      )
    }

    render(<ControlledCheckbox />)
    const checkbox = screen.getByRole('checkbox', { name: 'Sculpture' })
    expect(checkbox).not.toBeChecked()
    expect(screen.getByText('3')).toBeInTheDocument()

    await user.click(checkbox)
    expect(changes).toHaveBeenLastCalledWith(true)
    expect(checkbox).toBeChecked()

    await user.click(checkbox)
    expect(changes).toHaveBeenLastCalledWith(false)
    expect(checkbox).not.toBeChecked()
  })
})
