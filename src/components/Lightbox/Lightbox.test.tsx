import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { Lightbox, type LightboxImage, useLightbox } from '@/components/Lightbox/Lightbox'

const images: LightboxImage[] = [
  { image: { src: 'https://example.com/a.jpg', alt: 'Alpha' }, caption: 'Alpha' },
  { image: { src: 'https://example.com/b.jpg', alt: 'Beta' }, caption: 'Beta' },
  { image: { src: 'https://example.com/c.jpg', alt: 'Gamma' }, caption: 'Gamma' },
]

const noOrigin = () => null

function Harness({ images: list = images, at = 1 }: { images?: LightboxImage[]; at?: number }) {
  const lightbox = useLightbox()
  return (
    <>
      <button type="button" onClick={() => lightbox.open(at)}>
        open lightbox
      </button>
      <Lightbox {...lightbox.props} images={list} getOrigin={noOrigin} />
    </>
  )
}

async function openLightbox() {
  const user = userEvent.setup()
  render(<Harness />)
  await user.click(screen.getByRole('button', { name: 'open lightbox' }))
  const dialog = await screen.findByRole('dialog', { name: 'Image lightbox' })
  return { user, dialog }
}

const stageOf = (dialog: HTMLElement) =>
  dialog.querySelector('img')?.closest<HTMLElement>('[style*="translate3d"]') ?? dialog

function swipe(stage: HTMLElement, dx: number, dy: number) {
  const touch = { pointerId: 7, pointerType: 'touch' }
  fireEvent.pointerDown(stage, { ...touch, clientX: 300, clientY: 300 })
  fireEvent.pointerMove(stage, { ...touch, clientX: 300 + dx, clientY: 300 + dy })
  fireEvent.pointerUp(stage, { ...touch, clientX: 300 + dx, clientY: 300 + dy })
}

describe('Lightbox', () => {
  it('opens at the requested image and steps with the arrow buttons', async () => {
    const { user } = await openLightbox()
    expect(screen.getByText('2 / 3')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Next image' }))
    expect(screen.getByText('Gamma')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Next image' }))
    expect(screen.getByText('Alpha')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Previous image' }))
    expect(screen.getByText('Gamma')).toBeInTheDocument()
  })

  it('steps with the arrow keys', async () => {
    const { user } = await openLightbox()
    await user.keyboard('{ArrowLeft}')
    expect(screen.getByText('Alpha')).toBeInTheDocument()
    await user.keyboard('{ArrowRight}{ArrowRight}')
    expect(screen.getByText('Gamma')).toBeInTheDocument()
  })

  it('steps on a horizontal swipe and closes on a downward one', async () => {
    const { dialog } = await openLightbox()
    const stage = stageOf(dialog)

    swipe(stage, -120, 0)
    expect(screen.getByText('Gamma')).toBeInTheDocument()

    swipe(stage, 120, 0)
    expect(screen.getByText('Beta')).toBeInTheDocument()

    swipe(stage, 0, 200)
    await waitFor(() => expect(dialog).toHaveAttribute('data-state', 'closed'))
  })

  it('closes from the bar button', async () => {
    const { user, dialog } = await openLightbox()
    await user.click(screen.getByRole('button', { name: 'Close lightbox' }))
    expect(dialog).toHaveAttribute('data-state', 'closed')
  })

  it('shows no counter or arrows for a single image', async () => {
    const user = userEvent.setup()
    render(<Harness images={[images[0]!]} at={0} />)
    await user.click(screen.getByRole('button', { name: 'open lightbox' }))
    await screen.findByRole('dialog', { name: 'Image lightbox' })
    expect(screen.queryByRole('button', { name: 'Next image' })).not.toBeInTheDocument()
    expect(screen.queryByText(/\/ 1/)).not.toBeInTheDocument()
  })
})
