'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

type DraggableStatic = typeof import('gsap/Draggable').Draggable

const GLIDE = { ease: 'power3', duration: 0.725 } as const
const PIXELS_PER_SECOND = 100
const WHEEL_GESTURE_MS = 140
const WHEEL_LINE_PX = 16
const WHEEL_STEP_PX = [340, 1100, 2600]
const MOVING_QUIET_MS = 120

/** Held for as long as frames keep arriving. The carousel recipe reads
 *  `data-moving` to make slide content inert while the strip is under way. */
function movementFlag(element: HTMLElement) {
  let timer: number | undefined
  return {
    ping() {
      element.dataset.moving = ''
      if (timer) window.clearTimeout(timer)
      timer = window.setTimeout(() => {
        delete element.dataset.moving
      }, MOVING_QUIET_MS)
    },
    dispose() {
      if (timer) window.clearTimeout(timer)
      delete element.dataset.moving
    },
  }
}

// React delegates onWheel, so preventDefault from a JSX handler is ignored;
// only a directly-attached non-passive listener can cancel the page scroll.
function attachWheel(element: HTMLElement, scrollBy: (delta: number) => void) {
  const onWheel = (event: WheelEvent) => {
    if (Math.abs(event.deltaX) <= Math.abs(event.deltaY)) return
    event.preventDefault()
    const delta =
      event.deltaMode === WheelEvent.DOM_DELTA_PIXEL ? event.deltaX : event.deltaX * WHEEL_LINE_PX
    scrollBy(delta)
  }
  element.addEventListener('wheel', onWheel, { passive: false })
  return () => element.removeEventListener('wheel', onWheel)
}

function wheelStepper(begin: () => number, commit: (index: number) => void, maxSteps: number) {
  let timer: number | undefined
  let base = 0
  let accumulated = 0
  let issued = 0
  let active = false
  return {
    push(delta: number) {
      if (!active) {
        active = true
        accumulated = 0
        issued = 0
        base = begin()
      }
      accumulated += delta
      if (timer) window.clearTimeout(timer)
      timer = window.setTimeout(() => {
        active = false
      }, WHEEL_GESTURE_MS)
      const magnitude = Math.abs(accumulated)
      const crossed = WHEEL_STEP_PX.filter((threshold) => magnitude >= threshold).length
      if (crossed === 0) return
      const steps = Math.min(crossed, maxSteps) * Math.sign(accumulated)
      if (steps === issued) return
      issued = steps
      commit(base + steps)
    },
    dispose() {
      if (timer) window.clearTimeout(timer)
    },
  }
}

// `gsap.getProperty` returns a unit-suffixed string whenever a unit is asked
// for, so every read has to be parsed, not coerced.
const num = (value: string | number) => Number.parseFloat(String(value))

const wrapIndex = (index: number, length: number) => ((index % length) + length) % length

// How many slides sit ahead of the one the composition actually reads as
// current — the stage masks its leading slides, so the timeline index and the
// displayed index differ. Declared by the recipe, because only the CSS knows
// how wide the mask is at this breakpoint.
function readFocusOffset(element: Element) {
  const raw = getComputedStyle(element).getPropertyValue('--carousel-focus-offset')
  const parsed = Number.parseInt(raw, 10)
  return Number.isFinite(parsed) ? parsed : 0
}

/** The elements the rail comes to rest on. Declared by the recipe, because
 *  only the CSS knows that below md in portrait a slide's images are laid out
 *  as separate pages rather than as one composed grid. */
function pages(track: HTMLElement, slides: HTMLElement[]) {
  const mode = getComputedStyle(track).getPropertyValue('--carousel-snap-mode').trim()
  if (mode !== 'image') return slides
  const marked = Array.from(track.querySelectorAll<HTMLElement>('[data-carousel-snap]'))
  return marked.length > 0 ? marked : slides
}

const at = (values: Float64Array, index: number) => values[index] ?? 0

interface Controls {
  next: () => void
  previous: () => void
  toIndex: (index: number) => void
}

interface Engine extends Controls {
  dispose: () => void
}

function getClosest(values: Float64Array, value: number, wrap: number) {
  let i = values.length
  let closest = Number.POSITIVE_INFINITY
  let index = 0
  while (i--) {
    let distance = Math.abs(at(values, i) - value)
    if (distance > wrap / 2) distance = wrap - distance
    if (distance < closest) {
      closest = distance
      index = i
    }
  }
  return index
}

/**
 * GreenSock's published `horizontalLoop` helper, ported from
 * https://codepen.io/osmosupply/pen/NPKqByd. It builds a seamless wrap by
 * tweening every item's `xPercent` across the combined track width on one
 * timeline, then scrubbing that timeline instead of moving a container.
 */
function loopingTrack(
  gsap: GSAP,
  Draggable: DraggableStatic,
  items: HTMLElement[],
  onChange: (index: number) => void,
): Engine | null {
  const length = items.length
  const first = items[0]
  const last = items[length - 1]
  const container = first?.parentElement
  if (!first || !last || !container) return null

  if (items.some((el) => el.offsetWidth === 0)) return null

  let focusOffset = readFocusOffset(container)
  const moving = movementFlag(container)
  const report = (index: number) => onChange(wrapIndex(index + focusOffset, length))

  const times = new Float64Array(length)
  const widths = new Float64Array(length)
  const spaceBefore = new Float64Array(length)
  const xPercents = new Float64Array(length)
  const startX = first.offsetLeft
  // Some browsers shift a flex item by a pixel between layouts, so percentages
  // alternate by a fraction and the wrap point drifts. Snapping removes it.
  const snap = gsap.utils.snap(1)
  const wrapProgress = gsap.utils.wrap(0, 1)

  let curIndex = 0
  let lastIndex = 0
  let indexIsDirty = false
  let totalWidth = 0
  let timeWrap = (value: number) => value
  let ratio = 0
  let startProgress = 0
  let lastSnap = 0
  let initChangeX = 0

  const closestIndex = (setCurrent = false) => {
    const index = getClosest(times, tl.time(), tl.duration())
    if (setCurrent) {
      curIndex = index
      indexIsDirty = false
    }
    return index
  }

  const tl = gsap.timeline({
    paused: true,
    defaults: { ease: 'none' },
    onUpdate() {
      moving.ping()
      const index = closestIndex()
      if (lastIndex === index) return
      lastIndex = index
      report(index)
    },
    onReverseComplete() {
      tl.totalTime(tl.rawTime() + tl.duration() * 100)
    },
  })

  const getTotalWidth = () =>
    last.offsetLeft +
    (at(xPercents, length - 1) / 100) * at(widths, length - 1) -
    startX +
    at(spaceBefore, 0) +
    last.offsetWidth * num(gsap.getProperty(last, 'scaleX'))

  const populateWidths = () => {
    let previous = container.getBoundingClientRect()
    items.forEach((el, i) => {
      widths[i] = num(gsap.getProperty(el, 'width', 'px'))
      xPercents[i] = snap(
        (num(gsap.getProperty(el, 'x', 'px')) / at(widths, i)) * 100 +
          num(gsap.getProperty(el, 'xPercent')),
      )
      const box = el.getBoundingClientRect()
      spaceBefore[i] = box.left - (i ? previous.right : previous.left)
      previous = box
    })
    gsap.set(items, { xPercent: (i: number) => at(xPercents, i) })
    totalWidth = getTotalWidth()
  }

  const populateTimeline = () => {
    tl.clear()
    for (let i = 0; i < length; i++) {
      const item = items[i]
      if (!item) continue
      const curX = (at(xPercents, i) / 100) * at(widths, i)
      const distanceToStart = item.offsetLeft + curX - startX + at(spaceBefore, 0)
      const distanceToLoop = distanceToStart + at(widths, i) * num(gsap.getProperty(item, 'scaleX'))
      tl.to(
        item,
        {
          xPercent: snap(((curX - distanceToLoop) / at(widths, i)) * 100),
          duration: distanceToLoop / PIXELS_PER_SECOND,
        },
        0,
      )
        .fromTo(
          item,
          { xPercent: snap(((curX - distanceToLoop + totalWidth) / at(widths, i)) * 100) },
          {
            xPercent: at(xPercents, i),
            duration: (totalWidth - distanceToLoop) / PIXELS_PER_SECOND,
            immediateRender: false,
          },
          distanceToLoop / PIXELS_PER_SECOND,
        )
        .add(`label${i}`, distanceToStart / PIXELS_PER_SECOND)
      times[i] = distanceToStart / PIXELS_PER_SECOND
    }
    timeWrap = gsap.utils.wrap(0, tl.duration())
  }

  const refresh = (deep: boolean) => {
    const progress = tl.progress()
    tl.progress(0, true)
    populateWidths()
    if (deep) populateTimeline()
    if (deep && draggable) tl.time(at(times, curIndex), true)
    else tl.progress(progress, true)
  }

  const onResize = () => {
    focusOffset = readFocusOffset(container)
    refresh(true)
  }

  const toIndex = (target: number, vars: GSAPTweenVars) => {
    let index = target
    if (Math.abs(index - curIndex) > length / 2) index += index > curIndex ? -length : length
    const newIndex = gsap.utils.wrap(0, length, index)
    let time = at(times, newIndex)
    if (time > tl.time() !== index > curIndex && index !== curIndex) {
      time += tl.duration() * (index > curIndex ? 1 : -1)
    }
    if (time < 0 || time > tl.duration()) vars.modifiers = { time: timeWrap }
    curIndex = newIndex
    vars.overwrite = true
    gsap.killTweensOf(proxy)
    tl.tweenTo(time, vars)
  }

  const current = () => (indexIsDirty ? closestIndex(true) : curIndex)

  gsap.set(items, { x: 0 })
  populateWidths()
  populateTimeline()
  window.addEventListener('resize', onResize)
  // Pre-render both ends so the first interaction is not the frame that pays
  // for building every tween.
  tl.progress(1, true).progress(0, true)

  const proxy = document.createElement('div')
  const align = () => {
    if (!draggable) return
    tl.progress(wrapProgress(startProgress + (draggable.startX - draggable.x) * ratio))
  }
  const draggable: Draggable | undefined = Draggable.create(proxy, {
    trigger: container,
    type: 'x',
    onPressInit() {
      const x = this.x
      gsap.killTweensOf(tl)
      tl.pause()
      startProgress = tl.progress()
      refresh(false)
      ratio = 1 / totalWidth
      initChangeX = startProgress / -ratio - x
      gsap.set(proxy, { x: startProgress / -ratio })
    },
    onDrag: align,
    onThrowUpdate: align,
    overshootTolerance: 0,
    inertia: true,
    snap(value: number) {
      if (Math.abs(startProgress / -ratio - this.x) < 10) return lastSnap + initChangeX
      const time = -(value * ratio) * tl.duration()
      const wrappedTime = timeWrap(time)
      const snapTime = at(times, getClosest(times, wrappedTime, tl.duration()))
      let dif = snapTime - wrappedTime
      if (Math.abs(dif) > tl.duration() / 2) dif += dif < 0 ? tl.duration() : -tl.duration()
      lastSnap = (time + dif) / tl.duration() / -ratio
      return lastSnap
    },
    onRelease() {
      closestIndex(true)
      if (draggable?.isThrowing) indexIsDirty = true
    },
    onThrowComplete: () => {
      closestIndex(true)
    },
  })[0]

  const stepper = wheelStepper(
    current,
    (index) => toIndex(index, { ...GLIDE }),
    Math.min(WHEEL_STEP_PX.length, Math.max(1, Math.floor((length - 1) / 2))),
  )
  const detachWheel = attachWheel(container.parentElement ?? container, stepper.push)

  closestIndex(true)
  lastIndex = curIndex
  report(curIndex)

  return {
    next: () => toIndex(current() + 1, { ...GLIDE }),
    previous: () => toIndex(current() - 1, { ...GLIDE }),
    toIndex: (index: number) => toIndex(index - focusOffset, { ...GLIDE }),
    dispose: () => {
      window.removeEventListener('resize', onResize)
      stepper.dispose()
      detachWheel()
      moving.dispose()
    },
  }
}

function boundedTrack(
  gsap: GSAP,
  Draggable: DraggableStatic,
  track: HTMLElement,
  slides: HTMLElement[],
  onChange: (index: number, count: number) => void,
): Engine | null {
  const frame = track.parentElement
  if (!slides[0] || !frame || slides.some((el) => el.offsetWidth === 0)) return null

  let items = pages(track, slides)
  let points = new Float64Array(items.length)
  const moving = movementFlag(track)
  let minX = 0

  const measure = () => {
    items = pages(track, slides)
    points = new Float64Array(items.length)
    // Measured against the track rather than read off `offsetLeft`: a page can
    // be an image nested inside a slide, and `will-change: transform` on the
    // slide makes it that image's `offsetParent` in Blink and WebKit. The
    // track's own transform cancels out, since both rects carry it.
    const origin = track.getBoundingClientRect().left
    const spans = items.map((el) => {
      const box = el.getBoundingClientRect()
      return { left: box.left - origin, right: box.right - origin }
    })
    const base = spans[0]?.left ?? 0
    // The strip's start carries the track's leading gutter, so the end is
    // measured against the frame's width; netting the gutter out again stops
    // the rail a gutter short and clips the last slide.
    const end = spans[spans.length - 1]?.right ?? 0
    minX = Math.min(frame.clientWidth - end, 0)
    spans.forEach((span, i) => {
      points[i] = Math.max(-(span.left - base), minX)
    })
  }

  const indexAt = (x: number) => getClosest(points, x, Number.POSITIVE_INFINITY)

  let lastIndex = 0
  const report = () => {
    moving.ping()
    const index = indexAt(num(gsap.getProperty(track, 'x')))
    if (lastIndex === index) return
    lastIndex = index
    onChange(index, items.length)
  }

  measure()
  const onResize = () => {
    const before = items.length
    measure()
    draggable?.applyBounds({ minX, maxX: 0 })
    if (items.length === before) return
    lastIndex = Math.min(lastIndex, items.length - 1)
    onChange(lastIndex, items.length)
  }
  window.addEventListener('resize', onResize)

  const draggable: Draggable | undefined = Draggable.create(track, {
    type: 'x',
    bounds: { minX, maxX: 0 },
    inertia: true,
    edgeResistance: 0.9,
    snap: { x: (value: number) => at(points, indexAt(value)) },
    onDrag: report,
    onThrowUpdate: report,
    onThrowComplete: report,
  })[0]

  const go = (target: number) => {
    const index = Math.min(Math.max(target, 0), items.length - 1)
    gsap.to(track, {
      x: at(points, index),
      ...GLIDE,
      overwrite: true,
      onUpdate: report,
      onComplete: report,
    })
  }

  const stepper = wheelStepper(() => lastIndex, go, WHEEL_STEP_PX.length)
  const detachWheel = attachWheel(frame, stepper.push)

  onChange(0, items.length)

  return {
    next: () => go(lastIndex + 1),
    previous: () => go(lastIndex - 1),
    toIndex: go,
    dispose: () => {
      window.removeEventListener('resize', onResize)
      stepper.dispose()
      detachWheel()
      moving.dispose()
    },
  }
}

interface UseCarouselEngineOptions {
  slideCount: number
  loop: boolean
  animated: boolean
}

export function useCarouselEngine({ slideCount, loop, animated }: UseCarouselEngineOptions) {
  const trackRef = useRef<HTMLDivElement>(null)
  const engineRef = useRef<Engine | null>(null)
  const pageRef = useRef(0)
  const [page, setPage] = useState(0)
  const [pageCount, setPageCount] = useState(slideCount)

  const report = useCallback(
    (index: number, count = slideCount) => {
      pageRef.current = index
      setPage(index)
      setPageCount(count)
    },
    [slideCount],
  )

  useEffect(() => {
    const track = trackRef.current
    if (!track || !animated || slideCount < 2) return
    const state = { disposed: false }
    let context: gsap.Context | undefined

    void (async () => {
      const [core, draggableModule, inertiaModule] = await Promise.all([
        import('gsap'),
        import('gsap/Draggable'),
        import('gsap/InertiaPlugin'),
      ])
      if (state.disposed || !track.isConnected) return
      const { gsap } = core
      const { Draggable } = draggableModule
      gsap.registerPlugin(Draggable, inertiaModule.InertiaPlugin)

      const items = Array.from(track.children).filter(
        (node): node is HTMLElement => node instanceof HTMLElement,
      )

      context = gsap.context(() => {
        const engine = loop
          ? loopingTrack(gsap, Draggable, items, report)
          : boundedTrack(gsap, Draggable, track, items, report)
        if (!engine) return
        track.scrollLeft = 0
        track.dataset.engine = loop ? 'loop' : 'bounded'
        engineRef.current = engine
        return engine.dispose
      }, track)
    })().catch((error: unknown) => {
      console.error('Carousel engine failed to start; falling back to scroll.', error)
    })

    return () => {
      state.disposed = true
      engineRef.current = null
      context?.revert()
      delete track.dataset.engine
      setPageCount(slideCount)
    }
  }, [animated, loop, slideCount, report])

  /** Pre-hydration, reduced-motion and no-JS all land here: the track is still
   *  a scroll-snap strip, so navigation stays real without the engine. */
  const scrollToIndex = useCallback((index: number) => {
    pageRef.current = index
    setPage(index)
    const track = trackRef.current
    const item = track?.children[index]
    if (!track || !(item instanceof HTMLElement)) return
    // Easing comes from the track's own `scroll-behavior`, which the recipe
    // already flips to `auto` under reduced motion.
    track.scrollLeft = item.offsetLeft - track.offsetLeft
  }, [])

  const wrapIndex = useCallback(
    (index: number) => {
      if (loop) return ((index % slideCount) + slideCount) % slideCount
      return Math.min(Math.max(index, 0), slideCount - 1)
    },
    [loop, slideCount],
  )

  const next = useCallback(() => {
    const engine = engineRef.current
    if (engine) engine.next()
    else scrollToIndex(wrapIndex(pageRef.current + 1))
  }, [scrollToIndex, wrapIndex])

  const previous = useCallback(() => {
    const engine = engineRef.current
    if (engine) engine.previous()
    else scrollToIndex(wrapIndex(pageRef.current - 1))
  }, [scrollToIndex, wrapIndex])

  const toIndex = useCallback(
    (index: number) => {
      const engine = engineRef.current
      if (engine) engine.toIndex(index)
      else scrollToIndex(wrapIndex(index))
    },
    [scrollToIndex, wrapIndex],
  )

  return { trackRef, page, pageCount, next, previous, toIndex }
}
