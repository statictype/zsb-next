'use client'

import { type RefObject, useEffect, useRef, useState } from 'react'
import { ENGINE_ATTR, MOVING_ATTR, SNAP_PAGE_ATTR } from '@/components/Carousel/carousel-contract'

type DraggableStatic = typeof import('gsap/Draggable').Draggable

const GLIDE = { ease: 'power3', duration: 0.725 } as const
const PIXELS_PER_SECOND = 100
const WHEEL_LINE_PX = 16
const WHEEL_STEP_PX = [340, 1100, 2600]
const WHEEL_GESTURE_MS = 140
const MOVING_QUIET_MS = 120

export type SnapMode = 'slide' | 'image'

export interface CarouselLayout {
  focusOffset: number
  snap: SnapMode
}

export interface CarouselEngineOptions extends CarouselLayout {
  trackRef: RefObject<HTMLDivElement | null>
  slideCount: number
  animated: boolean
}

const wrapIndex = (index: number, length: number) => ((index % length) + length) % length

function closestIndex(values: ArrayLike<number>, value: number, wrap: number) {
  let i = values.length
  let closest = Number.POSITIVE_INFINITY
  let index = 0
  while (i--) {
    let distance = Math.abs((values[i] ?? 0) - value)
    if (distance > wrap / 2) distance = wrap - distance
    if (distance < closest) {
      closest = distance
      index = i
    }
  }
  return index
}

function nearestTarget(target: number, current: number, length: number) {
  if (Math.abs(target - current) <= length / 2) return target
  return target + (target > current ? -length : length)
}

const wheelStepLimit = (pageCount: number) =>
  Math.min(WHEEL_STEP_PX.length, Math.max(1, Math.floor((pageCount - 1) / 2)))

function wheelStepper(
  begin: () => number,
  commit: (index: number) => void,
  maxSteps: () => number,
) {
  let timer: ReturnType<typeof setTimeout> | undefined
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
      if (timer) clearTimeout(timer)
      timer = setTimeout(() => {
        active = false
      }, WHEEL_GESTURE_MS)
      const magnitude = Math.abs(accumulated)
      const crossed = WHEEL_STEP_PX.filter((threshold) => magnitude >= threshold).length
      if (crossed === 0) return
      const steps = Math.min(crossed, maxSteps()) * Math.sign(accumulated)
      if (steps === issued) return
      issued = steps
      commit(base + steps)
    },
    dispose() {
      if (timer) clearTimeout(timer)
    },
  }
}

function movementFlag(element: HTMLElement) {
  let timer: number | undefined
  return {
    ping() {
      element.setAttribute(MOVING_ATTR, '')
      if (timer) window.clearTimeout(timer)
      timer = window.setTimeout(() => {
        element.removeAttribute(MOVING_ATTR)
      }, MOVING_QUIET_MS)
    },
    dispose() {
      if (timer) window.clearTimeout(timer)
      element.removeAttribute(MOVING_ATTR)
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

// `gsap.getProperty` returns a unit-suffixed string whenever a unit is asked
// for, so every read has to be parsed, not coerced.
const num = (value: string | number) => Number.parseFloat(String(value))

function pages(track: HTMLElement, slides: HTMLElement[], snap: SnapMode) {
  if (snap !== 'image') return slides
  const marked = Array.from(track.querySelectorAll<HTMLElement>(`[${SNAP_PAGE_ATTR}]`))
  return marked.length > 0 ? marked : slides
}

const at = (values: Float64Array, index: number) => values[index] ?? 0

interface Engine {
  next: () => void
  previous: () => void
  toIndex: (index: number) => void
  relayout: (layout: CarouselLayout) => void
  dispose: () => void
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
  initialLayout: CarouselLayout,
  onChange: (index: number, count: number) => void,
): Engine | null {
  const length = items.length
  const first = items[0]
  const last = items[length - 1]
  const container = first?.parentElement
  if (!first || !last || !container) return null

  if (items.some((el) => el.offsetWidth === 0)) return null

  const firstBox = first.getBoundingClientRect()
  const inset = firstBox.left - container.getBoundingClientRect().left + container.scrollLeft
  const loopWidth = last.getBoundingClientRect().right - firstBox.left + inset
  const widest = Math.max(...items.map((el) => el.offsetWidth))
  if (loopWidth < container.clientWidth + widest) return null
  container.scrollTo({ left: 0, behavior: 'instant' })

  let layout = initialLayout
  const moving = movementFlag(container)

  const starts = new Float64Array(length)
  const widths = new Float64Array(length)
  const spaceBefore = new Float64Array(length)
  const xPercents = new Float64Array(length)
  let stops = new Float64Array(0)
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

  const report = (index: number) =>
    onChange(wrapIndex(index + layout.focusOffset, stops.length), stops.length)

  const closest = (setCurrent = false) => {
    const index = closestIndex(stops, tl.time(), tl.duration())
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
      const index = closest()
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
      ).fromTo(
        item,
        { xPercent: snap(((curX - distanceToLoop + totalWidth) / at(widths, i)) * 100) },
        {
          xPercent: at(xPercents, i),
          duration: (totalWidth - distanceToLoop) / PIXELS_PER_SECOND,
          immediateRender: false,
        },
        distanceToLoop / PIXELS_PER_SECOND,
      )
      starts[i] = distanceToStart
    }
    timeWrap = gsap.utils.wrap(0, tl.duration())
  }

  const populateStops = () => {
    const itemLefts = items.map((el) => el.getBoundingClientRect().left)
    const pageList = pages(container, items, layout.snap)
    stops = new Float64Array(pageList.length)
    pageList.forEach((page, index) => {
      const owner = Math.max(
        0,
        items.findIndex((item) => item.contains(page)),
      )
      const offset = page.getBoundingClientRect().left - (itemLefts[owner] ?? 0)
      stops[index] = (at(starts, owner) + offset - at(spaceBefore, 0)) / PIXELS_PER_SECOND
    })
    curIndex = Math.min(curIndex, stops.length - 1)
  }

  const refresh = (deep: boolean) => {
    const progress = tl.progress()
    tl.progress(0, true)
    populateWidths()
    if (deep) {
      populateTimeline()
      populateStops()
    }
    if (deep && draggable) tl.time(at(stops, curIndex), true)
    else tl.progress(progress, true)
  }

  const relayout = (next: CarouselLayout) => {
    const count = stops.length
    const focusOffset = layout.focusOffset
    layout = next
    refresh(true)
    if (stops.length === count && layout.focusOffset === focusOffset) return
    lastIndex = curIndex
    report(curIndex)
  }

  const onResize = () => relayout(layout)

  const toIndex = (target: number, vars: GSAPTweenVars) => {
    const count = stops.length
    const index = nearestTarget(target, curIndex, count)
    const newIndex = wrapIndex(index, count)
    let time = at(stops, newIndex)
    if (time > tl.time() !== index > curIndex && index !== curIndex) {
      time += tl.duration() * (index > curIndex ? 1 : -1)
    }
    if (time < 0 || time > tl.duration()) vars.modifiers = { time: timeWrap }
    curIndex = newIndex
    vars.overwrite = true
    gsap.killTweensOf(proxy)
    tl.tweenTo(time, vars)
  }

  const current = () => (indexIsDirty ? closest(true) : curIndex)

  gsap.set(items, { x: 0 })
  populateWidths()
  populateTimeline()
  populateStops()
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
      const snapTime = at(stops, closestIndex(stops, wrappedTime, tl.duration()))
      let dif = snapTime - wrappedTime
      if (Math.abs(dif) > tl.duration() / 2) dif += dif < 0 ? tl.duration() : -tl.duration()
      lastSnap = (time + dif) / tl.duration() / -ratio
      return lastSnap
    },
    onRelease() {
      closest(true)
      if (draggable?.isThrowing) indexIsDirty = true
    },
    onThrowComplete: () => {
      closest(true)
    },
  })[0]

  const stepper = wheelStepper(
    current,
    (index) => toIndex(index, { ...GLIDE }),
    () => wheelStepLimit(stops.length),
  )
  const detachWheel = attachWheel(container.parentElement ?? container, stepper.push)

  closest(true)
  lastIndex = curIndex
  report(curIndex)

  return {
    next: () => toIndex(current() + 1, { ...GLIDE }),
    previous: () => toIndex(current() - 1, { ...GLIDE }),
    toIndex: (index: number) => toIndex(index - layout.focusOffset, { ...GLIDE }),
    relayout,
    dispose: () => {
      window.removeEventListener('resize', onResize)
      stepper.dispose()
      detachWheel()
      moving.dispose()
    },
  }
}

let pendingRuntime: Promise<{ gsap: GSAP; Draggable: DraggableStatic }> | null = null

function loadDragRuntime() {
  pendingRuntime ??= Promise.all([
    import('gsap'),
    import('gsap/Draggable'),
    import('gsap/InertiaPlugin'),
  ]).then(([core, draggableModule, inertiaModule]) => {
    const { gsap } = core
    const { Draggable } = draggableModule
    gsap.registerPlugin(Draggable, inertiaModule.InertiaPlugin)
    return { gsap, Draggable }
  })
  return pendingRuntime
}

export function useCarouselEngine({
  trackRef,
  slideCount,
  animated,
  focusOffset,
  snap,
}: CarouselEngineOptions) {
  const engineRef = useRef<Engine | null>(null)
  const layoutRef = useRef<CarouselLayout>({ focusOffset, snap })
  const pageRef = useRef(0)
  const [page, setPage] = useState(0)
  const [pageCount, setPageCount] = useState(slideCount)

  useEffect(() => {
    layoutRef.current = { focusOffset, snap }
    engineRef.current?.relayout(layoutRef.current)
  }, [focusOffset, snap])

  useEffect(() => {
    const track = trackRef.current
    if (!track || !animated || slideCount < 2) return
    const state = { disposed: false }
    let context: gsap.Context | undefined

    const report = (index: number, count: number) => {
      pageRef.current = index
      setPage(index)
      setPageCount(count)
    }

    loadDragRuntime()
      .then(({ gsap, Draggable }) => {
        if (state.disposed || !track.isConnected) return

        const items = Array.from(track.children).filter(
          (node): node is HTMLElement => node instanceof HTMLElement,
        )

        context = gsap.context(() => {
          const engine = loopingTrack(gsap, Draggable, items, layoutRef.current, report)
          if (!engine) return
          track.setAttribute(ENGINE_ATTR, '')
          engineRef.current = engine
          return engine.dispose
        }, track)
      })
      .catch((error: unknown) => {
        console.error('Carousel engine failed to start; falling back to scroll.', error)
      })

    return () => {
      state.disposed = true
      engineRef.current = null
      context?.revert()
      track.removeAttribute(ENGINE_ATTR)
      setPageCount(slideCount)
    }
  }, [trackRef, animated, slideCount])

  /** Pre-hydration, reduced-motion, no-JS and strips too short to loop all
   *  land here: the track is still a scroll-snap strip, so navigation stays
   *  real without the engine. */
  const scrollToIndex = (index: number) => {
    pageRef.current = index
    setPage(index)
    const track = trackRef.current
    const item = track?.children[index]
    if (!track || !(item instanceof HTMLElement)) return
    // Easing comes from the track's own `scroll-behavior`, which the recipe
    // already flips to `auto` under reduced motion.
    track.scrollLeft = item.offsetLeft - track.offsetLeft
  }

  const next = () => {
    const engine = engineRef.current
    if (engine) engine.next()
    else scrollToIndex(wrapIndex(pageRef.current + 1, slideCount))
  }

  const previous = () => {
    const engine = engineRef.current
    if (engine) engine.previous()
    else scrollToIndex(wrapIndex(pageRef.current - 1, slideCount))
  }

  const toIndex = (index: number) => {
    const engine = engineRef.current
    if (engine) engine.toIndex(index)
    else scrollToIndex(wrapIndex(index, slideCount))
  }

  return { page, pageCount, next, previous, toIndex }
}
