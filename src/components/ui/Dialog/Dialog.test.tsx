import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { renderToString } from 'react-dom/server'
import { describe, expect, it, vi } from 'vitest'
import { Dialog } from './Dialog'

function DialogHarness({ accessibleLabel = false }: { accessibleLabel?: boolean }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>
        Open details
      </button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        presentation="panel"
        {...(accessibleLabel ? { ariaLabel: 'Event details' } : { title: 'Sculpture event' })}
      >
        <button type="button">Inside action</button>
      </Dialog>
    </>
  )
}

describe('Dialog', () => {
  it('activates dismissal when hydrating an already-open dialog', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    const dialog = (
      <Dialog open onClose={onClose} presentation="panel" title="Cold event">
        <p>Event content</p>
      </Dialog>
    )
    const container = document.createElement('div')
    container.innerHTML = renderToString(dialog)
    document.body.append(container)
    render(dialog, { container, hydrate: true })

    expect(await screen.findByRole('dialog', { name: 'Cold event' })).toBeInTheDocument()
    await user.keyboard('{Escape}')
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('is labelled, dismisses on Escape, and restores focus', async () => {
    const user = userEvent.setup()
    render(<DialogHarness />)

    const opener = screen.getByRole('button', { name: 'Open details' })
    await user.click(opener)
    const dialog = screen.getByRole('dialog', { name: 'Sculpture event' })
    await waitFor(() => expect(dialog).toHaveFocus())

    await user.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
    await waitFor(() => expect(opener).toHaveFocus())
  })

  it('supports an accessible label without rendering a title', async () => {
    const user = userEvent.setup()
    render(<DialogHarness accessibleLabel />)

    await user.click(screen.getByRole('button', { name: 'Open details' }))
    expect(screen.getByRole('dialog', { name: 'Event details' })).toBeInTheDocument()
    expect(screen.queryByText('Sculpture event')).not.toBeInTheDocument()
  })
})
