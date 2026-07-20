import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it } from 'vitest'
import { Lightbox, type LightboxImage } from '@/components/Lightbox/Lightbox'

const images: LightboxImage[] = [
  { image: { src: 'https://example.com/a.jpg', alt: 'Alpha' }, caption: 'Alpha' },
  { image: { src: 'https://example.com/b.jpg', alt: 'Beta' }, caption: 'Beta' },
  { image: { src: 'https://example.com/c.jpg', alt: 'Gamma' }, caption: 'Gamma' },
]

function Harness() {
  const [index, setIndex] = useState<number | null>(null)
  return (
    <>
      <button type="button" onClick={() => setIndex(0)}>
        open lightbox
      </button>
      <Lightbox
        images={images}
        index={index}
        onClose={() => setIndex(null)}
        onIndexChange={setIndex}
      />
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
