import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { type LightboxImage, useLightbox } from './Lightbox'

const images: LightboxImage[] = [
  { src: 'https://example.com/a.jpg', caption: 'Alpha' },
  { src: 'https://example.com/b.jpg', caption: 'Beta' },
  { src: 'https://example.com/c.jpg', caption: 'Gamma' },
]

function Harness() {
  const lightbox = useLightbox(images)
  return (
    <>
      <button type="button" onClick={() => lightbox.open(0)}>
        open lightbox
      </button>
      {lightbox.element}
    </>
  )
}

describe('Lightbox', () => {
  it('navigates with the arrow buttons without closing', async () => {
    const user = userEvent.setup()
    render(<Harness />)

    await user.click(screen.getByRole('button', { name: 'open lightbox' }))
    const dialog = await screen.findByRole('dialog', { name: 'Image lightbox' })
    expect(dialog).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Next image' }))
    expect(screen.getByRole('dialog', { name: 'Image lightbox' })).toBeInTheDocument()
    expect(screen.getByText('Beta')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Previous image' }))
    expect(screen.getByRole('dialog', { name: 'Image lightbox' })).toBeInTheDocument()
    expect(screen.getByText('Alpha')).toBeInTheDocument()
  })
})
