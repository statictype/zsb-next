'use client'

import { useEffect, useLayoutEffect, useRef } from 'react'
import { token } from 'styled-system/tokens'
import { useReducedMotion } from '@/components/reduced-motion'

interface MotionRuntime {
  gsap: typeof import('gsap').gsap
  Flip: typeof import('gsap/Flip').Flip
}

let pending: Promise<MotionRuntime> | null = null

function loadMotionRuntime(): Promise<MotionRuntime> {
  pending ??= Promise.all([import('gsap'), import('gsap/Flip')]).then(([core, flipModule]) => {
    const { gsap } = core
    const { Flip } = flipModule
    gsap.registerPlugin(Flip)
    return { gsap, Flip }
  })
  return pending
}

interface Rect {
  left: number
  top: number
  width: number
  height: number
}

interface Size {
  width: number
  height: number
}

function containRect(natural: Size, container: Rect): Rect {
  if (natural.width <= 0 || natural.height <= 0) return container
  const scale = Math.min(container.width / natural.width, container.height / natural.height)
  const width = natural.width * scale
  const height = natural.height * scale
  return {
    left: container.left + (container.width - width) / 2,
    top: container.top + (container.height - height) / 2,
    width,
    height,
  }
}

function elementRect(el: Element): Rect {
  const { left, top, width, height } = el.getBoundingClientRect()
  return { left, top, width, height }
}

function intersectsViewport(rect: Rect): boolean {
  return (
    rect.width > 0 &&
    rect.height > 0 &&
    rect.left < window.innerWidth &&
    rect.top < window.innerHeight &&
    rect.left + rect.width > 0 &&
    rect.top + rect.height > 0
  )
}

const FLIGHT_DURATION = 0.55
const CHROME_DURATION = 0.3
const SETTLE_DURATION = 0.18

interface Flight {
  source: string
  from: Rect
  to: Rect
  objectPosition: string
  filter: string
  zIndex: string
  onSettle: () => void
}

function applyRect(style: CSSStyleDeclaration, rect: Rect): void {
  style.left = `${rect.left}px`
  style.top = `${rect.top}px`
  style.width = `${rect.width}px`
  style.height = `${rect.height}px`
}

function fly({ gsap, Flip }: MotionRuntime, flight: Flight): void {
  const clone = document.createElement('img')
  clone.src = flight.source
  clone.alt = ''
  const style = clone.style
  style.position = 'fixed'
  style.margin = '0'
  style.objectFit = 'cover'
  style.objectPosition = flight.objectPosition
  style.filter = flight.filter
  style.zIndex = flight.zIndex
  style.pointerEvents = 'none'
  applyRect(style, flight.from)
  document.body.append(clone)

  const state = Flip.getState(clone)
  applyRect(style, flight.to)

  Flip.from(state, {
    duration: FLIGHT_DURATION,
    ease: 'power3.inOut',
    onComplete: () => {
      flight.onSettle()
      gsap.to(clone, {
        opacity: 0,
        duration: SETTLE_DURATION,
        onComplete: () => clone.remove(),
      })
    },
  })
}

const COLUMNS_NARROW = 6
const COLUMNS_WIDE = 14
const NARROW_MAX_WIDTH = 768
const TILE_DURATION = 0.35
const TILE_SPREAD = 0.45
const SEAM_OVERLAP_PX = 1

function clearDissolve({ gsap }: MotionRuntime, overlay: HTMLElement): void {
  const tiles = Array.from(overlay.children)
  if (tiles.length > 0) gsap.killTweensOf(tiles)
  overlay.replaceChildren()
}

function dissolveFrom(
  runtime: MotionRuntime,
  image: HTMLImageElement,
  overlay: HTMLElement,
  onDone: () => void,
): boolean {
  const source = image.currentSrc || image.src
  if (!source || image.naturalWidth === 0) return false

  const box = overlay.getBoundingClientRect()
  if (box.width === 0 || box.height === 0) return false

  const content = containRect(
    { width: image.naturalWidth, height: image.naturalHeight },
    { left: 0, top: 0, width: box.width, height: box.height },
  )
  if (content.width === 0 || content.height === 0) return false

  clearDissolve(runtime, overlay)

  const columns = window.innerWidth < NARROW_MAX_WIDTH ? COLUMNS_NARROW : COLUMNS_WIDE
  const rows = Math.max(1, Math.round((columns * box.height) / box.width))
  const tileWidth = box.width / columns
  const tileHeight = box.height / rows
  const tiles: HTMLElement[] = []

  for (let row = 0; row < rows; row++) {
    for (let column = 0; column < columns; column++) {
      const left = column * tileWidth
      const top = row * tileHeight
      const covered =
        left < content.left + content.width &&
        left + tileWidth > content.left &&
        top < content.top + content.height &&
        top + tileHeight > content.top
      if (!covered) continue

      const tile = document.createElement('div')
      const style = tile.style
      style.position = 'absolute'
      style.left = `${left}px`
      style.top = `${top}px`
      style.width = `${tileWidth + SEAM_OVERLAP_PX}px`
      style.height = `${tileHeight + SEAM_OVERLAP_PX}px`
      // Reuses the browser's decoded copy of `currentSrc`; no second request.
      style.backgroundImage = `url("${source}")`
      style.backgroundSize = `${content.width}px ${content.height}px`
      style.backgroundPosition = `${content.left - left}px ${content.top - top}px`
      style.backgroundRepeat = 'no-repeat'
      style.willChange = 'opacity'
      tiles.push(tile)
    }
  }
  if (tiles.length === 0) return false

  overlay.append(...tiles)

  const { gsap } = runtime
  gsap.to(gsap.utils.shuffle(tiles), {
    opacity: 0,
    duration: TILE_DURATION,
    ease: 'power3.out',
    stagger: { amount: TILE_SPREAD },
    onComplete: () => {
      overlay.replaceChildren()
      onDone()
    },
  })
  return true
}

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
  }, [isOpen])

  useLayoutEffect(() => {
    if (!isOpen || flownRef.current) return
    flownRef.current = true

    const runtime = runtimeRef.current
    const root = rootRef.current
    const stage = stageRef.current
    const imageLayer = imageLayerRef.current
    if (runtime && root && imageLayer)
      runtime.gsap.set([root, imageLayer], { clearProps: 'opacity' })
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
