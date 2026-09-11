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
    render(<Carousel label="Gallery" mode="rail" eyebrow="Photographs" slides={slides} />)

    expect(screen.getByRole('region', { name: 'Gallery' })).toBeInTheDocument()
    expect(screen.getByText('Photographs')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Previous gallery slide' })).toBeEnabled()
    expect(screen.getByRole('button', { name: 'Next gallery slide' })).toBeEnabled()
  })

  it('renders the stage with no chrome, only the slides', () => {
    render(<Carousel label="Hero" mode="stage" slides={slides} />)

    expect(screen.getByRole('region', { name: 'Hero' })).toBeInTheDocument()
    expect(screen.getAllByRole('group', { name: /of 3$/ })).toHaveLength(3)
    expect(screen.queryAllByRole('button')).toHaveLength(0)
  })

  it('wraps from the first slide to the last without the engine', async () => {
    const user = userEvent.setup()
    render(<Carousel label="Gallery" mode="rail" slides={slides} />)

    await user.click(screen.getByRole('button', { name: 'Previous gallery slide' }))
    await waitFor(() =>
      expect(screen.getByRole('group', { name: '3 of 3' })).toHaveAttribute('data-current'),
    )
  })

  it('suppresses the click that ends a mouse drag but lets static clicks through', () => {
    const onSlideClick = vi.fn()
    render(
      <Carousel
        label="Gallery"
        mode="rail"
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
