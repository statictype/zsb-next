'use client'

import { RiArrowLeftLine, RiArrowRightLine, RiCloseLine } from '@remixicon/react'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { cx } from 'styled-system/css'
import { token } from 'styled-system/tokens'
import { Figure } from '@/components/Figure/Figure'
import { lightbox as lightboxRecipe } from '@/components/Lightbox/Lightbox.recipe'
import { POINTER_DRAG_TOLERANCE_PX } from '@/components/pointer-gesture'
import { Button } from '@/components/ui/Button/Button'
import { Dialog } from '@/components/ui/Dialog/Dialog'
import { Eyebrow } from '@/components/ui/Eyebrow/Eyebrow'
import type { ImageData } from '@/types/edition'

export interface LightboxImage {
  image: ImageData
  caption?: string
}

// Must match the recipe's frame geometry so the browser picks a variant sized
// to the actual rendered width.
const SIZES = `(min-width: ${token('sizes.breakpoint-md')}) ${token('sizes.lightboxFrameMax')}, ${token('sizes.lightboxFrameWidth')}`

interface LightboxProps {
  images: LightboxImage[]
  index: number | null
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

export function Lightbox({ images, index, onClose, onIndexChange }: LightboxProps) {
  const [drag, setDrag] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const dragRef = useRef<DragState | null>(null)

  const isOpen = index !== null
  // Keep the exit transition on the image that was open once index goes null.
  const [lastIndex, setLastIndex] = useState(0)
  if (index !== null && index !== lastIndex) setLastIndex(index)
  const displayIndex = index ?? lastIndex

  const onNext = () => {
    if (index !== null) onIndexChange(stepIndex(index, 1, images.length))
  }
  const onPrev = () => {
    if (index !== null) onIndexChange(stepIndex(index, -1, images.length))
  }

  // Depend on `index`, not onNext/onPrev — render-scoped fns would re-arm the
  // listener every render.
  const count = images.length
  useEffect(() => {
    if (index === null) return

    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') onIndexChange(stepIndex(index, -1, count))
      if (e.key === 'ArrowRight') onIndexChange(stepIndex(index, 1, count))
    }

    document.addEventListener('keydown', handleKeydown)
    return () => document.removeEventListener('keydown', handleKeydown)
  }, [index, count, onIndexChange])

  if (!images.length) return null

  const current = images[displayIndex]
  if (!current) return null
  const caption = current.caption ?? ''

  const prevIndex = stepIndex(displayIndex, -1, images.length)
  const nextIndex = stepIndex(displayIndex, 1, images.length)
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
      if (d.dy >= threshold) onClose()
    }
    setDrag({ x: 0, y: 0 })
  }

  const verticalProgress = Math.min(1, drag.y / VERTICAL_FADE_DISTANCE)
  const backdropAlpha = 0.95 * (1 - verticalProgress * 0.5)
  const normal = token('durations.normal')
  const quint = token('easings.quint')
  const frameStyle = {
    transform: `translate3d(${drag.x}px, ${drag.y}px, 0)`,
    transition: isDragging ? 'none' : `transform ${normal} ${quint}, opacity ${normal} ${quint}`,
    opacity: 1 - verticalProgress * 0.4,
  }

  const stop = (e: React.MouseEvent) => {
    e.stopPropagation()
  }

  const s = lightboxRecipe()

  return (
    <Dialog open={isOpen} onClose={onClose} ariaLabel="Image lightbox" presentation="fullscreen">
      {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions -- backdrop click closes; the close Button is the accessible path */}
      <div
        className={s.lightbox}
        onClick={onClose}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        style={{ backgroundColor: `rgba(0, 0, 0, ${backdropAlpha})` }}
      >
        <Button
          variant="icon"
          className={cx(s.close)}
          onClick={onClose}
          aria-label="Close lightbox"
        >
          <RiCloseLine size={28} />
        </Button>

        {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions -- frame letterbox click closes; the close Button is the accessible path */}
        <div className={s.frame} style={frameStyle} onClick={onClose}>
          <Figure
            key={current.image.src}
            image={current.image}
            sizes={SIZES}
            className={s.image}
            onClick={stop}
            draggable={false}
          />
        </div>

        {caption && <Eyebrow className={s.caption}>{caption}</Eyebrow>}

        {images.length > 1 && (
          <>
            <Button
              variant="icon"
              className={cx(s.nav, s.navPrev)}
              onClick={(e) => {
                e.stopPropagation()
                onPrev()
              }}
              aria-label="Previous image"
            >
              <RiArrowLeftLine size={20} />
            </Button>
            <Button
              variant="icon"
              className={cx(s.nav, s.navNext)}
              onClick={(e) => {
                e.stopPropagation()
                onNext()
              }}
              aria-label="Next image"
            >
              <RiArrowRightLine size={20} />
            </Button>
          </>
        )}

        {isOpen && preloadSrcs.length > 0 && (
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
