'use client'

import { useEffect, useState } from 'react'

interface UseSlideshowOptions {
  count: number
  wrap?: boolean
  autoplay?: number | false
}

export function useSlideshow({ count, wrap = false, autoplay = false }: UseSlideshowOptions) {
  const [index, setIndex] = useState(0)
  const [resetKey, setResetKey] = useState(0)

  function clamp(i: number): number {
    if (count === 0) return 0
    if (wrap) return ((i % count) + count) % count
    return Math.max(0, Math.min(count - 1, i))
  }

  function goTo(i: number) {
    setIndex(clamp(i))
    setResetKey((k) => k + 1)
  }

  function next() {
    setIndex((i) => clamp(i + 1))
    setResetKey((k) => k + 1)
  }

  function prev() {
    setIndex((i) => clamp(i - 1))
    setResetKey((k) => k + 1)
  }

  useEffect(() => {
    if (!autoplay || count <= 1) return
    const id = setInterval(() => {
      setIndex((i) => (wrap ? (i + 1) % count : Math.min(i + 1, count - 1)))
    }, autoplay)
    return () => clearInterval(id)
  }, [autoplay, count, wrap, resetKey])

  const canPrev = wrap || index > 0
  const canNext = wrap || index < count - 1

  return { index, next, prev, goTo, canPrev, canNext }
}
