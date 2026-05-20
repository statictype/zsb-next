'use client'

import { RiArrowLeftLine, RiArrowRightLine, RiCloseLine } from '@remixicon/react'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import shared from '@/components/Shared.module.css'
import { useBodyScrollLock } from '@/lib/use-body-scroll-lock'
import styles from './Lightbox.module.css'

export interface LightboxImage {
  src: string
  caption: string
}

const SIZES = '(min-width: 768px) calc(100vw - 160px), 90vw'

export function useLightbox(images: LightboxImage[]) {
  const [isOpen, setIsOpen] = useState(false)
  const [index, setIndex] = useState(0)

  const open = (i: number) => {
    setIndex(i)
    setIsOpen(true)
  }
  const close = () => setIsOpen(false)
  const next = () => setIndex((i) => (i + 1) % images.length)
  const prev = () => setIndex((i) => (i - 1 + images.length) % images.length)

  return {
    open,
    element: (
      <LightboxView
        images={images}
        index={index}
        isOpen={isOpen}
        onClose={close}
        onNext={next}
        onPrev={prev}
      />
    ),
  }
}

interface LightboxViewProps {
  images: LightboxImage[]
  index: number
  isOpen: boolean
  onClose: () => void
  onNext: () => void
  onPrev: () => void
}

interface DragState {
  pointerId: number
  startX: number
  startY: number
  dx: number
  dy: number
  axis: 'h' | 'v' | null
}

const AXIS_LOCK_THRESHOLD = 8
const SWIPE_NAV_THRESHOLD_RATIO = 0.2
const SWIPE_NAV_MAX = 80
const SWIPE_CLOSE_THRESHOLD_RATIO = 0.25
const SWIPE_CLOSE_MAX = 150

function LightboxView({ images, index, isOpen, onClose, onNext, onPrev }: LightboxViewProps) {
  const [loadedSrc, setLoadedSrc] = useState<string | null>(null)
  const [drag, setDrag] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const dragRef = useRef<DragState | null>(null)

  useBodyScrollLock(isOpen)

  useEffect(() => {
    if (!isOpen) return

    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') onPrev()
      if (e.key === 'ArrowRight') onNext()
    }

    document.addEventListener('keydown', handleKeydown)
    return () => document.removeEventListener('keydown', handleKeydown)
  }, [isOpen, onClose, onNext, onPrev])

  if (!images.length) return null

  const current = images[index]
  if (!current) return null

  const loaded = loadedSrc === current.src

  const prevIndex = (index - 1 + images.length) % images.length
  const nextIndex = (index + 1) % images.length
  const preloadSrcs = Array.from(
    new Set(
      [images[prevIndex]?.src, images[nextIndex]?.src].filter(
        (s): s is string => !!s && s !== current.src,
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
      if (ax > AXIS_LOCK_THRESHOLD || ay > AXIS_LOCK_THRESHOLD) {
        d.axis = ax > ay ? 'h' : 'v'
        setIsDragging(true)
      } else {
        return
      }
    }
    if (d.axis === 'h') {
      setDrag({ x: d.dx, y: 0 })
    } else {
      // Vertical: only downward drag translates; up clamps to 0
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

  const verticalProgress = Math.min(1, drag.y / 300)
  const backdropAlpha = 0.95 * (1 - verticalProgress * 0.5)
  const frameStyle = {
    transform: `translate3d(${drag.x}px, ${drag.y}px, 0)`,
    transition: isDragging ? 'none' : 'transform 0.3s var(--ease-out-expo), opacity 0.3s ease',
    opacity: 1 - verticalProgress * 0.4,
  }

  const stop = (e: React.MouseEvent) => {
    e.stopPropagation()
  }

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: backdrop dismiss pattern
    <div
      className={`${styles.lightbox} ${isOpen ? styles.isActive : ''}`}
      onClick={onClose}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      style={{ backgroundColor: `rgba(0, 0, 0, ${backdropAlpha})` }}
    >
      <button type="button" className={styles.close} onClick={onClose} aria-label="Close lightbox">
        <RiCloseLine size={28} />
      </button>

      {/* biome-ignore lint/a11y/noStaticElementInteractions: frame letterbox click closes */}
      <div className={styles.frame} style={frameStyle} onClick={onClose}>
        {!loaded && <span aria-hidden className={shared.skeleton} />}
        <Image
          key={current.src}
          src={current.src}
          alt={current.caption}
          fill
          sizes={SIZES}
          className={styles.image}
          style={{ opacity: loaded ? 1 : 0 }}
          onLoad={() => setLoadedSrc(current.src)}
          onClick={stop}
          draggable={false}
        />
      </div>

      {current.caption && (
        // biome-ignore lint/a11y/noStaticElementInteractions: caption click is a no-op
        <div className={styles.caption} onClick={stop}>
          {current.caption}
        </div>
      )}

      {images.length > 1 && (
        <>
          <button
            type="button"
            className={`${styles.nav} ${styles.navPrev}`}
            onClick={(e) => {
              e.stopPropagation()
              onPrev()
            }}
            aria-label="Previous image"
          >
            <RiArrowLeftLine size={20} />
          </button>
          <button
            type="button"
            className={`${styles.nav} ${styles.navNext}`}
            onClick={(e) => {
              e.stopPropagation()
              onNext()
            }}
            aria-label="Next image"
          >
            <RiArrowRightLine size={20} />
          </button>
        </>
      )}

      {isOpen && preloadSrcs.length > 0 && (
        <div className={styles.preload} aria-hidden>
          {preloadSrcs.map((src) => (
            <div key={src} className={styles.preloadFrame}>
              <Image src={src} alt="" fill sizes={SIZES} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
