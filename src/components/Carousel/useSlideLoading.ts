import { type RefObject, useEffect, useState } from 'react'

export type SlideLoading = 'deferred' | 'lazy' | 'eager'

function afterLoadIdle(callback: () => void): () => void {
  let cancel = () => {}
  const schedule = () => {
    if (typeof window.requestIdleCallback === 'function') {
      const handle = window.requestIdleCallback(callback, { timeout: 2000 })
      cancel = () => window.cancelIdleCallback(handle)
    } else {
      const handle = globalThis.setTimeout(callback, 200)
      cancel = () => globalThis.clearTimeout(handle)
    }
  }
  if (document.readyState === 'complete') {
    schedule()
    return () => cancel()
  }
  window.addEventListener('load', schedule, { once: true })
  return () => {
    window.removeEventListener('load', schedule)
    cancel()
  }
}

function slidesInFrame(frame: HTMLElement, track: HTMLElement): number[] {
  const box = frame.getBoundingClientRect()
  return Array.from(track.children).flatMap((item, index) => {
    const rect = item.getBoundingClientRect()
    return rect.right > box.left && rect.left < box.right ? [index] : []
  })
}

export function useSlideLoading({
  frameRef,
  trackRef,
  page,
}: {
  frameRef: RefObject<HTMLElement | null>
  trackRef: RefObject<HTMLElement | null>
  page: number
}) {
  const [loaded, setLoaded] = useState<ReadonlySet<number>>(() => new Set())
  const [engaged, setEngaged] = useState(false)
  const [lastPage, setLastPage] = useState(page)

  const add = (indices: number[]) =>
    setLoaded((prev) =>
      indices.every((index) => prev.has(index)) ? prev : new Set([...prev, ...indices]),
    )

  if (lastPage !== page) {
    setLastPage(page)
    add([lastPage])
  }

  useEffect(
    () =>
      afterLoadIdle(() => {
        const frame = frameRef.current
        const track = trackRef.current
        if (frame && track) add(slidesInFrame(frame, track))
      }),
    [frameRef, trackRef],
  )

  return {
    loadingFor: (index: number): SlideLoading =>
      index === 0 ? 'lazy' : engaged || index === page || loaded.has(index) ? 'eager' : 'deferred',
    engage: () => setEngaged(true),
  }
}
