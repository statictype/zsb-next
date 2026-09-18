import { act, renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { useCarouselEngine } from '@/components/Carousel/useCarouselEngine'

const fake = vi.hoisted(() => {
  const props = new WeakMap<Element, Record<string, number>>()
  const read = (el: Element) => props.get(el) ?? {}

  function timeline(vars: { onUpdate?: () => void }) {
    let ends: number[] = []
    let time = 0
    const duration = () => Math.max(0, ...ends)
    const tl = {
      to(_t: unknown, tween: { duration: number }, position: number) {
        ends.push(position + tween.duration)
        return tl
      },
      fromTo(_t: unknown, _from: unknown, tween: { duration: number }, position: number) {
        ends.push(position + tween.duration)
        return tl
      },
      clear() {
        ends = []
        return tl
      },
      duration,
      time(value?: number) {
        if (value === undefined) return time
        time = value
        return tl
      },
      progress(value?: number) {
        if (value === undefined) return duration() ? time / duration() : 0
        time = value * duration()
        return tl
      },
      totalTime: () => tl,
      rawTime: () => time,
      pause: () => tl,
      tweenTo(target: number, tween: { modifiers?: { time?: (value: number) => number } }) {
        time = tween.modifiers?.time ? tween.modifiers.time(target) : target
        vars.onUpdate?.()
        return tl
      },
    }
    return tl
  }

  const gsap = {
    utils: {
      snap: (increment: number) => (value: number) => Math.round(value / increment) * increment,
      wrap: (min: number, max: number) => (value: number) => {
        const range = max - min
        return range ? ((((value - min) % range) + range) % range) + min : min
      },
    },
    set(targets: Element | Element[], vars: Record<string, number | ((i: number) => number)>) {
      const list = Array.isArray(targets) ? targets : [targets]
      list.forEach((el, i) => {
        const next = { ...read(el) }
        for (const [key, value] of Object.entries(vars)) {
          next[key] = typeof value === 'function' ? value(i) : value
        }
        props.set(el, next)
      })
    },
    getProperty(el: HTMLElement, key: string, unit?: string) {
      const value = key === 'width' ? el.offsetWidth : key === 'scaleX' ? 1 : (read(el)[key] ?? 0)
      return unit ? `${value}${unit}` : value
    },
    timeline,
    killTweensOf() {},
    registerPlugin() {},
    context(fn: () => (() => void) | undefined) {
      const cleanup = fn()
      return { revert: () => cleanup?.() }
    },
  }

  const Draggable = { create: () => [{ x: 0, startX: 0, isThrowing: false }] }
  return { gsap, Draggable }
})

vi.mock('gsap', () => ({ gsap: fake.gsap }))
vi.mock('gsap/Draggable', () => ({ Draggable: fake.Draggable }))
vi.mock('gsap/InertiaPlugin', () => ({ InertiaPlugin: {} }))

function box(el: Element, left: number, width: number) {
  Object.defineProperty(el, 'getBoundingClientRect', {
    value: () => ({ left, right: left + width, width, top: 0, bottom: 0, height: 0 }),
    configurable: true,
  })
}

function strip({
  slides,
  frameWidth,
  slideWidth,
  pagesPerSlide = 1,
}: {
  slides: number
  frameWidth: number
  slideWidth: number
  pagesPerSlide?: number
}) {
  const frame = document.createElement('div')
  const track = document.createElement('div')
  frame.append(track)
  document.body.append(frame)
  Object.defineProperty(track, 'clientWidth', { value: frameWidth })
  Object.defineProperty(track, 'offsetLeft', { value: 0 })
  box(track, 0, frameWidth)
  for (let i = 0; i < slides; i++) {
    const slide = document.createElement('div')
    const left = i * slideWidth
    Object.defineProperty(slide, 'offsetWidth', { value: slideWidth })
    Object.defineProperty(slide, 'offsetLeft', { value: left })
    box(slide, left, slideWidth)
    const pageWidth = slideWidth / pagesPerSlide
    for (let p = 0; p < pagesPerSlide; p++) {
      const page = document.createElement('div')
      page.setAttribute('data-carousel-snap', '')
      box(page, left + p * pageWidth, pageWidth)
      slide.append(page)
    }
    track.append(slide)
  }
  return { frame, track }
}

type Layout = { focusOffset: number; snap: 'slide' | 'image' }

async function mount(
  config: Parameters<typeof strip>[0],
  layout: Layout = { focusOffset: 0, snap: 'slide' },
) {
  const { frame, track } = strip(config)
  const trackRef = { current: track }
  const hook = renderHook(
    (props: Layout) =>
      useCarouselEngine({ trackRef, slideCount: config.slides, animated: true, ...props }),
    { initialProps: layout },
  )
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 0))
  })
  return { frame, track, hook }
}

const wheel = (target: Element, deltaX: number, deltaY = 0) =>
  act(() => {
    target.dispatchEvent(new WheelEvent('wheel', { deltaX, deltaY, cancelable: true }))
  })

describe('useCarouselEngine', () => {
  it('starts the engine and wraps at both ends', async () => {
    const { track, hook } = await mount({ slides: 4, frameWidth: 1000, slideWidth: 500 })
    expect(track).toHaveAttribute('data-engine')
    expect(hook.result.current.pageCount).toBe(4)

    act(() => hook.result.current.next())
    expect(hook.result.current.page).toBe(1)

    act(() => hook.result.current.previous())
    act(() => hook.result.current.previous())
    expect(hook.result.current.page).toBe(3)

    hook.unmount()
    expect(track).not.toHaveAttribute('data-engine')
  })

  it('falls back to scrolling when the strip is too short to loop', async () => {
    const { track, hook } = await mount({ slides: 2, frameWidth: 1000, slideWidth: 500 })
    expect(track).not.toHaveAttribute('data-engine')

    act(() => hook.result.current.previous())
    expect(hook.result.current.page).toBe(1)
  })

  it('reports the slide the focus offset points at', async () => {
    const { track, hook } = await mount(
      { slides: 4, frameWidth: 1000, slideWidth: 500 },
      { focusOffset: 1, snap: 'slide' },
    )
    expect(track).toHaveAttribute('data-engine')
    expect(hook.result.current.page).toBe(1)

    act(() => hook.result.current.toIndex(3))
    expect(hook.result.current.page).toBe(3)

    hook.rerender({ focusOffset: 0, snap: 'slide' })
    expect(hook.result.current.page).toBe(2)
  })

  it('rests on every marked image when snapping by image', async () => {
    const { track, hook } = await mount(
      { slides: 3, frameWidth: 1000, slideWidth: 600, pagesPerSlide: 2 },
      { focusOffset: 0, snap: 'image' },
    )
    expect(track).toHaveAttribute('data-engine')
    expect(hook.result.current.pageCount).toBe(6)

    act(() => hook.result.current.next())
    act(() => hook.result.current.next())
    act(() => hook.result.current.next())
    expect(hook.result.current.page).toBe(3)

    hook.rerender({ focusOffset: 0, snap: 'slide' })
    expect(hook.result.current.pageCount).toBe(3)
  })

  it('steps on horizontal wheel travel, capped per gesture', async () => {
    const { frame, track, hook } = await mount({ slides: 5, frameWidth: 1000, slideWidth: 500 })
    expect(track).toHaveAttribute('data-engine')

    wheel(frame, 0, 400)
    expect(hook.result.current.page).toBe(0)

    wheel(frame, 400)
    expect(hook.result.current.page).toBe(1)
    wheel(frame, 800)
    expect(hook.result.current.page).toBe(2)
    wheel(frame, 2000)
    expect(hook.result.current.page).toBe(2)
  })
})
