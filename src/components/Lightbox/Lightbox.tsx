'use client'

import { RiArrowLeftSLine, RiArrowRightSLine, RiCloseLine } from '@remixicon/react'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { token } from 'styled-system/tokens'
import { Figure } from '@/components/Figure/Figure'
import { lightbox as lightboxRecipe } from '@/components/Lightbox/Lightbox.recipe'
import { useLightboxMotion } from '@/components/Lightbox/useLightboxMotion'
import { POINTER_DRAG_TOLERANCE_PX } from '@/components/pointer-gesture'
import { Button } from '@/components/ui/Button/Button'
import { Dialog } from '@/components/ui/Dialog/Dialog'
import type { ImageData } from '@/types/edition'

export interface LightboxImage {
  image: ImageData
  caption?: string
}

const SIZES = '100vw'
const CONTAIN = { objectFit: 'contain' } as const
const KEY_REPEAT_INTERVAL_MS = 220

interface LightboxProps {
  images: LightboxImage[]
  open: boolean
  index: number
  getOrigin: (index: number) => HTMLElement | null
  onClose: () => void
  onIndexChange: (index: number) => void
}

interface DragState {
  pointerId: number
  startX: number
  startY: number
  dx: number
  dy: number
  axis: 'h' | 'v' | null
}

const SWIPE_NAV_THRESHOLD_RATIO = 0.2
const SWIPE_NAV_MAX = 80
const SWIPE_CLOSE_THRESHOLD_RATIO = 0.25
const SWIPE_CLOSE_MAX = 150
const VERTICAL_FADE_DISTANCE = 300

function stepIndex(index: number, dir: 1 | -1, count: number): number {
  return (index + dir + count) % count
}

export function Lightbox({
  images,
  open,
  index,
  getOrigin,
  onClose,
  onIndexChange,
}: LightboxProps) {
  const [drag, setDrag] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const dragRef = useRef<DragState | null>(null)
  const repeatAt = useRef(0)

  const { rootRef, stageRef, imageLayerRef, overlayRef, goTo, requestClose } = useLightboxMotion({
    isOpen: open,
    index,
    getOrigin,
    onClose,
    onIndexChange,
  })

  const onNext = () => goTo(stepIndex(index, 1, images.length))
  const onPrev = () => goTo(stepIndex(index, -1, images.length))

  // Depend on `index`, not onNext/onPrev — render-scoped fns would re-arm the
  // listener every render.
  const count = images.length
  useEffect(() => {
    if (!open) return

    const handleKeydown = (e: KeyboardEvent) => {
      const dir = e.key === 'ArrowLeft' ? -1 : e.key === 'ArrowRight' ? 1 : 0
      if (dir === 0) return
      if (e.repeat) {
        const now = performance.now()
        if (now - repeatAt.current < KEY_REPEAT_INTERVAL_MS) return
        repeatAt.current = now
      }
      goTo(stepIndex(index, dir, count))
    }

    document.addEventListener('keydown', handleKeydown)
    return () => document.removeEventListener('keydown', handleKeydown)
  }, [open, index, count, goTo])

  if (!images.length) return null

  const current = images[index]
  if (!current) return null
  const caption = current.caption ?? ''
  const [firstName = '', ...restName] = caption.split(' ')
  const lastName = restName.join(' ')

  const prevIndex = stepIndex(index, -1, images.length)
  const nextIndex = stepIndex(index, 1, images.length)
  const preloadSrcs = Array.from(
    new Set(
      [images[prevIndex]?.image.src, images[nextIndex]?.image.src].filter(
        (s): s is string => !!s && s !== current.image.src,
      ),
    ),
  )

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'mouse') return
    dragRef.current = {
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      dx: 0,
      dy: 0,
      axis: null,
    }
  }

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = dragRef.current
    if (!d || d.pointerId !== e.pointerId) return
    d.dx = e.clientX - d.startX
    d.dy = e.clientY - d.startY
    if (!d.axis) {
      const ax = Math.abs(d.dx)
      const ay = Math.abs(d.dy)
      if (ax > POINTER_DRAG_TOLERANCE_PX || ay > POINTER_DRAG_TOLERANCE_PX) {
        d.axis = ax > ay ? 'h' : 'v'
        setIsDragging(true)
      } else {
        return
      }
    }
    if (d.axis === 'h') {
      setDrag({ x: d.dx, y: 0 })
    } else {
      setDrag({ x: 0, y: Math.max(0, d.dy) })
    }
  }

  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = dragRef.current
    if (!d || d.pointerId !== e.pointerId) return
    dragRef.current = null
    setIsDragging(false)

    if (d.axis === 'h') {
      const threshold = Math.min(SWIPE_NAV_MAX, window.innerWidth * SWIPE_NAV_THRESHOLD_RATIO)
      if (images.length > 1 && d.dx <= -threshold) onNext()
      else if (images.length > 1 && d.dx >= threshold) onPrev()
    } else if (d.axis === 'v') {
      const threshold = Math.min(SWIPE_CLOSE_MAX, window.innerHeight * SWIPE_CLOSE_THRESHOLD_RATIO)
      if (d.dy >= threshold) requestClose()
    }
    setDrag({ x: 0, y: 0 })
  }

  const verticalProgress = Math.min(1, drag.y / VERTICAL_FADE_DISTANCE)
  const backdropAlpha = 0.95 * (1 - verticalProgress * 0.5)
  const normal = token('durations.normal')
  const motion = token('easings.motion')
  const stageStyle = {
    transform: `translate3d(${drag.x}px, ${drag.y}px, 0)`,
    transition: isDragging ? 'none' : `transform ${normal} ${motion}, opacity ${normal} ${motion}`,
    opacity: 1 - verticalProgress * 0.4,
  }

  const s = lightboxRecipe()

  return (
    <Dialog open={open} onClose={requestClose} ariaLabel="Image lightbox" presentation="fullscreen">
      <div
        className={s.lightbox}
        ref={rootRef}
        style={{ backgroundColor: `rgba(0, 0, 0, ${backdropAlpha})` }}
      >
        {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions -- stage click closes; the close Button is the accessible path */}
        <div
          className={s.stage}
          ref={stageRef}
          style={stageStyle}
          onClick={requestClose}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
        >
          <div className={s.imageLayer} ref={imageLayerRef}>
            {/* next/image reads object-fit off the inline style only, and shapes the
                blur placeholder from it; via the class alone it stretches the LQIP
                to the full stage. */}
            <Figure
              key={current.image.src}
              image={current.image}
              sizes={SIZES}
              className={s.image}
              style={CONTAIN}
              draggable={false}
            />
          </div>
          <div className={s.dissolve} ref={overlayRef} aria-hidden />
        </div>

        <div className={s.bar}>
          <div className={s.barNav}>
            {images.length > 1 && (
              <>
                <span className={s.counter}>
                  {index + 1} / {images.length}
                </span>
                <Button variant="icon" onClick={onPrev} aria-label="Previous image">
                  <RiArrowLeftSLine size={20} />
                </Button>
                <Button variant="icon" onClick={onNext} aria-label="Next image">
                  <RiArrowRightSLine size={20} />
                </Button>
              </>
            )}
          </div>

          <span className={s.caption}>
            {lastName ? (
              <>
                <span>{firstName}</span> <span>{lastName}</span>
              </>
            ) : (
              caption
            )}
          </span>

          <Button
            variant="icon"
            className={s.close}
            onClick={requestClose}
            aria-label="Close lightbox"
          >
            <RiCloseLine size={20} />
          </Button>
        </div>

        {open && preloadSrcs.length > 0 && (
          <div className={s.preload} aria-hidden>
            {preloadSrcs.map((src) => (
              <div key={src} className={s.preloadFrame}>
                <Image src={src} alt="" fill sizes={SIZES} />
              </div>
            ))}
          </div>
        )}
      </div>
    </Dialog>
  )
}
