'use client'

import { useEffect, useRef, useState } from 'react'

interface UseScrollSnapStripOptions {
  count: number
}

interface DragState {
  pointerId: number
  startX: number
  startScroll: number
  moved: boolean
}

/**
 * Horizontal scroll-snap strip with mouse/pen drag-to-scroll, nearest-item
 * tracking, keyboard arrows, and click-suppression after a drag.
 *
 * Touch is left to native scrolling; only mouse + pen are hijacked. The drag
 * state survives pointer-up so the click that follows can read `.moved` and
 * suppress itself (a drag shouldn't open a lightbox). Consume that signal with
 * `consumeDrag()` at the top of the item click handler.
 *
 * `T` is the item element type (e.g. `HTMLDivElement` slides, `HTMLButtonElement`
 * cards). The track itself is always a `<div>`.
 */
export function useScrollSnapStrip<T extends HTMLElement = HTMLElement>({
  count,
}: UseScrollSnapStripOptions) {
  const trackRef = useRef<HTMLDivElement>(null)
  const itemRefs = useRef<(T | null)[]>([])
  const dragRef = useRef<DragState | null>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  const registerItem = (index: number) => (el: T | null) => {
    itemRefs.current[index] = el
  }

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    const onScroll = () => {
      const trackRect = track.getBoundingClientRect()
      let nearest = 0
      let minDist = Number.POSITIVE_INFINITY
      itemRefs.current.forEach((item, i) => {
        if (!item) return
        const rect = item.getBoundingClientRect()
        const dist = Math.abs(rect.left - trackRect.left)
        if (dist < minDist) {
          minDist = dist
          nearest = i
        }
      })
      setActiveIndex(nearest)
    }

    track.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => track.removeEventListener('scroll', onScroll)
  }, [])

  const scrollToIndex = (index: number) => {
    const item = itemRefs.current[index]
    const track = trackRef.current
    if (!item || !track) return
    track.scrollTo({
      left: item.offsetLeft - track.offsetLeft,
      behavior: 'smooth',
    })
  }

  const goPrev = () => scrollToIndex(Math.max(0, activeIndex - 1))
  const goNext = () => scrollToIndex(Math.min(count - 1, activeIndex + 1))

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // Let touch use native scrolling; only hijack mouse + pen.
    if (e.pointerType === 'touch') return
    if (e.button !== 0) return
    const track = trackRef.current
    if (!track) return
    // Don't capture or preventDefault yet — a plain click must reach the item's
    // onClick. We only commit to drag mode once movement crosses the threshold.
    dragRef.current = {
      pointerId: e.pointerId,
      startX: e.clientX,
      startScroll: track.scrollLeft,
      moved: false,
    }
  }

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current
    const track = trackRef.current
    if (!drag || !track || drag.pointerId !== e.pointerId) return
    // Hover (no button held) must not re-engage the drag — dragRef stays set
    // after release so the upcoming click can read `.moved`.
    if (e.buttons === 0) return
    const dx = e.clientX - drag.startX
    if (!drag.moved && Math.abs(dx) > 4) {
      // Threshold crossed: commit to drag mode.
      drag.moved = true
      track.setPointerCapture(e.pointerId)
      track.style.scrollBehavior = 'auto'
      track.style.scrollSnapType = 'none'
      track.style.cursor = 'grabbing'
    }
    if (drag.moved) {
      track.scrollLeft = drag.startScroll - dx
    }
  }

  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current
    const track = trackRef.current
    if (!drag || !track || drag.pointerId !== e.pointerId) return
    if (drag.moved) {
      track.releasePointerCapture(e.pointerId)
      track.style.scrollBehavior = ''
      track.style.scrollSnapType = ''
      track.style.cursor = ''

      const findNearest = (target: number) => {
        let nearest = 0
        let minDist = Number.POSITIVE_INFINITY
        itemRefs.current.forEach((item, i) => {
          if (!item) return
          const offset = item.offsetLeft - track.offsetLeft
          const dist = Math.abs(offset - target)
          if (dist < minDist) {
            minDist = dist
            nearest = i
          }
        })
        return nearest
      }

      const startIndex = findNearest(drag.startScroll)
      let targetIndex = findNearest(track.scrollLeft)

      // Swipe bias: even a small drag past the threshold should commit to the
      // next item in the drag direction, so a half-hearted drag doesn't bounce
      // back to where it started.
      const delta = track.scrollLeft - drag.startScroll
      const swipeThreshold = 50
      if (targetIndex === startIndex && Math.abs(delta) > swipeThreshold) {
        const direction = delta > 0 ? 1 : -1
        targetIndex = Math.max(0, Math.min(count - 1, startIndex + direction))
      }

      const target = itemRefs.current[targetIndex]
      if (target) {
        track.scrollTo({
          left: target.offsetLeft - track.offsetLeft,
          behavior: 'smooth',
        })
      }
    }
    // Keep dragRef set so the upcoming click handler can read `.moved`.
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault()
      goPrev()
    } else if (e.key === 'ArrowRight') {
      e.preventDefault()
      goNext()
    }
  }

  /**
   * Read-and-clear the drag flag. Call at the top of an item's click handler:
   * returns `true` if the click concluded a drag (caller should suppress its
   * action), `false` for a genuine click.
   */
  const consumeDrag = (): boolean => {
    const wasDrag = dragRef.current?.moved ?? false
    dragRef.current = null
    return wasDrag
  }

  /**
   * Wrap an item's click action with the drag guard: a click that concluded a
   * drag is swallowed (preventDefault, no-op), a genuine click runs `handler`.
   * The ergonomic path over reading {@link consumeDrag} by hand.
   */
  const guardClick = (handler: () => void) => (e: React.MouseEvent) => {
    if (consumeDrag()) {
      e.preventDefault()
      return
    }
    handler()
  }

  const trackProps = {
    onPointerDown,
    onPointerMove,
    onPointerUp: endDrag,
    onPointerCancel: endDrag,
    onKeyDown,
  }

  return {
    trackRef,
    activeIndex,
    registerItem,
    goPrev,
    goNext,
    trackProps,
    consumeDrag,
    guardClick,
  }
}
