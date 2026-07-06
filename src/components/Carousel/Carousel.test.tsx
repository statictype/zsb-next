import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { Carousel } from './Carousel'

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

  it('renders the rail control contract without autoplay controls', () => {
    render(
      <Carousel
        label="Gallery"
        mode="rail"
        autoplay={false}
        loop={false}
        eyebrow="Photographs"
        slides={slides}
      />,
    )

    expect(screen.getByRole('region', { name: 'Gallery' })).toBeInTheDocument()
    expect(screen.getByText('Photographs')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Previous gallery slide' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Next gallery slide' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /play gallery|pause gallery/i })).toBeNull()
  })

  it('renders stage indicators and pauses temporarily for pointer hover', async () => {
    render(<Carousel label="Hero" mode="stage" autoplay={5000} loop slides={slides} />)

    const indicators = screen.getAllByRole('button', { name: /go to slide/i })
    expect(indicators).toHaveLength(3)
    const playPause = screen.getByRole('button', { name: 'Pause hero' })
    await waitFor(() => expect(playPause).toHaveAttribute('data-pressed', ''))

    const interactionArea = screen.getByRole('region', { name: 'Hero' }).firstElementChild
    expect(interactionArea).not.toBeNull()
    fireEvent.pointerEnter(interactionArea!, { pointerType: 'mouse' })
    await waitFor(() => expect(playPause).not.toHaveAttribute('data-pressed'))

    fireEvent.pointerLeave(interactionArea!, { pointerType: 'mouse' })
    await waitFor(() => expect(playPause).toHaveAttribute('data-pressed', ''))
  })

  it('keeps an explicit pause until the user presses Play', async () => {
    const user = userEvent.setup()
    render(<Carousel label="Hero" mode="stage" autoplay={5000} loop slides={slides} />)

    const pause = screen.getByRole('button', { name: 'Pause hero' })
    await user.click(pause)
    const play = screen.getByRole('button', { name: 'Play hero' })
    expect(play).not.toHaveAttribute('data-pressed')

    const interactionArea = screen.getByRole('region', { name: 'Hero' }).firstElementChild
    fireEvent.pointerEnter(interactionArea!, { pointerType: 'mouse' })
    fireEvent.pointerLeave(interactionArea!, { pointerType: 'mouse' })
    await waitFor(() => expect(play).not.toHaveAttribute('data-pressed'))

    await user.click(play)
    expect(play).not.toHaveAttribute('data-pressed')
    fireEvent.blur(play, { relatedTarget: document.body })
    await waitFor(() => expect(play).toHaveAttribute('data-pressed', ''))
  })

  it('starts paused when reduced motion is requested', () => {
    setReducedMotion(true)
    render(<Carousel label="Hero" mode="stage" autoplay={5000} loop slides={slides} />)

    const play = screen.getByRole('button', { name: 'Play hero' })
    expect(play).not.toHaveAttribute('data-pressed')
  })

  it('suppresses the click that ends a mouse drag but lets static clicks through', () => {
    const onSlideClick = vi.fn()
    render(
      <Carousel
        label="Gallery"
        mode="rail"
        autoplay={false}
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
    // Zag hides off-"view" items in jsdom (no layout), so query by text.
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
