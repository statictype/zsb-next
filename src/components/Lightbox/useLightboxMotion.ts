'use client'

import { useEffect, useLayoutEffect, useRef } from 'react'
import { token } from 'styled-system/tokens'
import { clearDissolve, dissolveFrom } from '@/components/Lightbox/gridDissolve'
import { containRect, elementRect, intersectsViewport } from '@/components/Lightbox/imageRect'
import { CHROME_DURATION, fly } from '@/components/Lightbox/lightboxFlip'
import { loadMotionRuntime, type MotionRuntime } from '@/components/Lightbox/motionRuntime'
import { useReducedMotion } from '@/components/reduced-motion'

const REVEAL_DURATION = 0.18

interface UseLightboxMotionOptions {
  isOpen: boolean
  index: number
  getOrigin: (index: number) => HTMLElement | null
  onClose: () => void
  onIndexChange: (index: number) => void
}

export function useLightboxMotion({
  isOpen,
  index,
  getOrigin,
  onClose,
  onIndexChange,
}: UseLightboxMotionOptions) {
  const rootRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const imageLayerRef = useRef<HTMLDivElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const runtimeRef = useRef<MotionRuntime | null>(null)
  const flownRef = useRef(false)
  const closingRef = useRef(false)
  const dissolvingRef = useRef(false)

  const reducedMotion = useReducedMotion()

  useEffect(() => {
    if (reducedMotion) return
    const state = { disposed: false }
    void loadMotionRuntime()
      .then((runtime) => {
        if (!state.disposed) runtimeRef.current = runtime
      })
      .catch((error: unknown) => {
        console.error('Lightbox motion failed to load; falling back to CSS.', error)
      })
    return () => {
      state.disposed = true
    }
  }, [reducedMotion])

  useLayoutEffect(() => {
    if (isOpen || !flownRef.current) return
    flownRef.current = false
    closingRef.current = false
    dissolvingRef.current = false
    const runtime = runtimeRef.current
    const overlay = overlayRef.current
    if (runtime && overlay) clearDissolve(runtime, overlay)
    if (runtime) {
      if (rootRef.current) runtime.gsap.set(rootRef.current, { clearProps: 'opacity' })
      if (imageLayerRef.current) runtime.gsap.set(imageLayerRef.current, { clearProps: 'opacity' })
    }
  }, [isOpen])

  useLayoutEffect(() => {
    if (!isOpen || flownRef.current) return
    flownRef.current = true

    const runtime = runtimeRef.current
    const root = rootRef.current
    const stage = stageRef.current
    const imageLayer = imageLayerRef.current
    const origin = getOrigin(index)
    const originImage = origin?.querySelector('img')
    if (!runtime || !root || !stage || !imageLayer || !origin || !originImage) return
    if (originImage.naturalWidth === 0) return

    const from = elementRect(origin)
    if (!intersectsViewport(from)) return

    const to = containRect(
      { width: originImage.naturalWidth, height: originImage.naturalHeight },
      elementRect(stage),
    )
    const computed = getComputedStyle(originImage)
    const { gsap } = runtime

    gsap.set(root, { opacity: 0 })
    gsap.set(imageLayer, { opacity: 0 })
    gsap.to(root, { opacity: 1, duration: CHROME_DURATION })
    origin.style.visibility = 'hidden'

    fly(runtime, {
      source: originImage.currentSrc || originImage.src,
      objectPosition: computed.objectPosition,
      filter: computed.filter,
      from,
      to,
      zIndex: token('zIndex.lightboxFlip'),
      onSettle: () => {
        origin.style.visibility = ''
        gsap.to(imageLayer, { opacity: 1, duration: REVEAL_DURATION })
      },
    })
  }, [isOpen, index, getOrigin])

  const goTo = (next: number) => {
    if (dissolvingRef.current) return

    const runtime = runtimeRef.current
    const overlay = overlayRef.current
    const image = imageLayerRef.current?.querySelector('img')
    if (runtime && overlay && image) {
      dissolvingRef.current = true
      const started = dissolveFrom(runtime, image, overlay, () => {
        dissolvingRef.current = false
      })
      if (!started) dissolvingRef.current = false
    }
    onIndexChange(next)
  }

  const requestClose = () => {
    if (closingRef.current) return

    const runtime = runtimeRef.current
    const root = rootRef.current
    const stage = stageRef.current
    const imageLayer = imageLayerRef.current
    const image = imageLayer?.querySelector('img')
    const origin = getOrigin(index)
    const originImage = origin?.querySelector('img')
    if (!runtime || !root || !stage || !imageLayer || !image || !origin || !originImage) {
      onClose()
      return
    }
    if (image.naturalWidth === 0) {
      onClose()
      return
    }

    const to = elementRect(origin)
    if (!intersectsViewport(to)) {
      onClose()
      return
    }

    closingRef.current = true
    const from = containRect(
      { width: image.naturalWidth, height: image.naturalHeight },
      elementRect(stage),
    )
    const { gsap } = runtime
    const overlay = overlayRef.current
    if (overlay) clearDissolve(runtime, overlay)
    dissolvingRef.current = false

    origin.style.visibility = 'hidden'
    gsap.set(imageLayer, { opacity: 0 })
    gsap.to(root, { opacity: 0, duration: CHROME_DURATION, onComplete: onClose })

    fly(runtime, {
      source: image.currentSrc || image.src,
      objectPosition: getComputedStyle(originImage).objectPosition,
      filter: 'none',
      from,
      to,
      zIndex: token('zIndex.lightboxFlip'),
      onSettle: () => {
        origin.style.visibility = ''
      },
    })
  }

  return { rootRef, stageRef, imageLayerRef, overlayRef, goTo, requestClose }
}
