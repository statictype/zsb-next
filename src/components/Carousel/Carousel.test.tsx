import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { Carousel } from '@/components/Carousel/Carousel'

const slides = [
  { id: 'one', content: <span>First slide</span> },
  { id: 'two', content: <span>Second slide</span> },
  { id: 'three', content: <span>Third slide</span> },
]

function setReducedMotion(matches: boolean) {
  vi.mocked(window.matchMedia).mockImplementation((query: string) => ({
    matches,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }))
}

describe('Carousel', () => {
  beforeEach(() => setReducedMotion(false))

  it('renders the rail control contract', () => {
    render(
      <Carousel label="Gallery" mode="rail" loop={false} eyebrow="Photographs" slides={slides} />,
    )

    expect(screen.getByRole('region', { name: 'Gallery' })).toBeInTheDocument()
    expect(screen.getByText('Photographs')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Previous gallery slide' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Next gallery slide' })).toBeInTheDocument()
  })

  it('renders the stage with no chrome, only the slides', () => {
    render(<Carousel label="Hero" mode="stage" loop slides={slides} />)

    expect(screen.getByRole('region', { name: 'Hero' })).toBeInTheDocument()
    expect(screen.getAllByRole('group', { name: /of 3$/ })).toHaveLength(3)
    expect(screen.queryAllByRole('button')).toHaveLength(0)
  })

  it('bounds a non-looping rail at both ends', async () => {
    const user = userEvent.setup()
    render(<Carousel label="Gallery" mode="rail" loop={false} slides={slides} />)

    const prev = screen.getByRole('button', { name: 'Previous gallery slide' })
    const next = screen.getByRole('button', { name: 'Next gallery slide' })
    expect(prev).toBeDisabled()
    expect(next).toBeEnabled()

    await user.click(next)
    await waitFor(() => expect(prev).toBeEnabled())
  })

  it('suppresses the click that ends a mouse drag but lets static clicks through', () => {
    const onSlideClick = vi.fn()
    render(
      <Carousel
        label="Gallery"
        mode="rail"
        loop={false}
        slides={[
          {
            id: 'clickable',
            content: (
              <button type="button" onClick={onSlideClick}>
                Open me
              </button>
            ),
          },
        ]}
      />,
    )
    const target = screen.getByText('Open me')

    // Drag: pointer travels well past the tolerance before the click lands.
    fireEvent.pointerDown(target, { clientX: 200, clientY: 100 })
    fireEvent.click(target, { clientX: 80, clientY: 100, detail: 1 })
    expect(onSlideClick).not.toHaveBeenCalled()

    // Static click: no travel, must pass through.
    fireEvent.pointerDown(target, { clientX: 200, clientY: 100 })
    fireEvent.click(target, { clientX: 201, clientY: 100, detail: 1 })
    expect(onSlideClick).toHaveBeenCalledTimes(1)

    // Keyboard activation (click detail 0, no preceding pointerdown) passes.
    fireEvent.click(target, { detail: 0 })
    expect(onSlideClick).toHaveBeenCalledTimes(2)
  })
})
