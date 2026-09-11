import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { LightboxGallery } from '@/components/Carousel/LightboxGallery'
import type { LightboxImage } from '@/components/Lightbox/Lightbox'

const slides: LightboxImage[][] = [
  [
    { image: { src: 'https://example.com/a.jpg', alt: 'Alpha' }, caption: 'Alpha' },
    { image: { src: 'https://example.com/b.jpg', alt: 'Beta' }, caption: 'Beta' },
  ],
  [{ image: { src: 'https://example.com/c.jpg', alt: 'Gamma' }, caption: 'Gamma' }],
]

function Gallery() {
  return (
    <LightboxGallery
      label="Gallery"
      mode="rail"
      slides={slides}
      lightboxImages={(slide) => slide}
      renderSlide={(slide, trigger) =>
        slide.map((item, index) => (
          <button key={item.image.src} type="button" {...trigger(index)}>
            open {item.caption}
          </button>
        ))
      }
    />
  )
}

describe('LightboxGallery', () => {
  it('opens the lightbox at the clicked image, counting across slides', async () => {
    const user = userEvent.setup()
    render(<Gallery />)

    await user.click(screen.getByRole('button', { name: 'open Gamma' }))
    expect(await screen.findByRole('dialog', { name: 'Image lightbox' })).toBeInTheDocument()
    expect(screen.getByText('Gamma')).toBeInTheDocument()
    expect(screen.getByText('3 / 3')).toBeInTheDocument()
  })

  it('navigates with the arrow buttons without closing', async () => {
    const user = userEvent.setup()
    render(<Gallery />)

    await user.click(screen.getByRole('button', { name: 'open Alpha' }))
    await screen.findByRole('dialog', { name: 'Image lightbox' })

    await user.click(screen.getByRole('button', { name: 'Next image' }))
    expect(screen.getByRole('dialog', { name: 'Image lightbox' })).toBeInTheDocument()
    expect(screen.getByText('Beta')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Previous image' }))
    expect(screen.getByRole('dialog', { name: 'Image lightbox' })).toBeInTheDocument()
    expect(screen.getByText('Alpha')).toBeInTheDocument()
  })
})
