'use client'

import { RiArrowLeftLine, RiArrowRightLine } from '@remixicon/react'
import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Lightbox } from '@/components/Lightbox/Lightbox'
import { toLightboxImages } from '@/lib/format-utils'
import { imageSrc } from '@/lib/image-utils'
import { useLightbox } from '@/lib/use-lightbox'
import type { MediaKitItem } from '@/types/edition'
import styles from './MediaKitStrip.module.css'

export interface MediaKitStripItem extends MediaKitItem {
  year: number
}

interface MediaKitStripProps {
  items: MediaKitStripItem[]
}

const pad = (n: number) => String(n).padStart(2, '0')

export function MediaKitStrip({ items }: MediaKitStripProps) {
  const lightbox = useLightbox()
  const trackRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<(HTMLButtonElement | null)[]>([])
  const [activeIndex, setActiveIndex] = useState(0)

  const lightboxImages = toLightboxImages(
    items.map((item) => ({
      ...item.image,
      caption: `${item.year} · ${item.name}`,
    })),
  )

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    const onScroll = () => {
      const trackRect = track.getBoundingClientRect()
      let nearest = 0
      let minDist = Number.POSITIVE_INFINITY
      cardRefs.current.forEach((card, i) => {
        if (!card) return
        const rect = card.getBoundingClientRect()
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

  const scrollToCard = useCallback((index: number) => {
    const card = cardRefs.current[index]
    const track = trackRef.current
    if (!card || !track) return
    track.scrollTo({
      left: card.offsetLeft - track.offsetLeft,
      behavior: 'smooth',
    })
  }, [])

  const goPrev = () => scrollToCard(Math.max(0, activeIndex - 1))
  const goNext = () => scrollToCard(Math.min(items.length - 1, activeIndex + 1))

  // ---- Mouse drag-to-scroll ----
  const dragRef = useRef<{
    pointerId: number
    startX: number
    startScroll: number
    moved: boolean
  } | null>(null)

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // Let touch use native scrolling; only hijack mouse + pen.
    if (e.pointerType === 'touch') return
    if (e.button !== 0) return
    const track = trackRef.current
    if (!track) return
    // Stop the browser from starting a native image drag.
    e.preventDefault()
    dragRef.current = {
      pointerId: e.pointerId,
      startX: e.clientX,
      startScroll: track.scrollLeft,
      moved: false,
    }
    track.setPointerCapture(e.pointerId)
    track.style.scrollBehavior = 'auto'
    track.style.cursor = 'grabbing'
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

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current
    const track = trackRef.current
    if (!drag || !track || drag.pointerId !== e.pointerId) return
    const dx = e.clientX - drag.startX
    if (Math.abs(dx) > 4) drag.moved = true
    track.scrollLeft = drag.startScroll - dx
  }

  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current
    const track = trackRef.current
    if (!drag || !track || drag.pointerId !== e.pointerId) return
    track.releasePointerCapture(e.pointerId)
    track.style.scrollBehavior = ''
    track.style.cursor = ''
    dragRef.current = null
  }

  const onCardClick = (e: React.MouseEvent, index: number) => {
    // Suppress click after a drag.
    if (dragRef.current?.moved) {
      e.preventDefault()
      return
    }
    lightbox.open(index)
  }

  return (
    <>
      <div className={styles.controls}>
        <div className={styles.counter}>
          <span className={styles.counterCurrent}>{pad(activeIndex + 1)}</span>
          <span className={styles.counterTotal}>/ {pad(items.length)}</span>
        </div>
        <div className={styles.arrows}>
          <button
            type="button"
            className={styles.arrow}
            onClick={goPrev}
            disabled={activeIndex === 0}
            aria-label="Previous poster"
          >
            <RiArrowLeftLine size={20} />
          </button>
          <button
            type="button"
            className={styles.arrow}
            onClick={goNext}
            disabled={activeIndex === items.length - 1}
            aria-label="Next poster"
          >
            <RiArrowRightLine size={20} />
          </button>
        </div>
      </div>

      <div className={styles.viewport}>
        <div
          ref={trackRef}
          className={styles.track}
          tabIndex={0}
          role="region"
          aria-label="Media kit posters"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onKeyDown={onKeyDown}
        >
          {items.map((item, i) => (
            <button
              key={`${item.year}-${i}`}
              ref={(el) => {
                cardRefs.current[i] = el
              }}
              type="button"
              className={styles.card}
              onClick={(e) => onCardClick(e, i)}
              aria-label={`Open ${item.year} ${item.name}`}
            >
              <Image
                src={imageSrc(item.image)}
                alt={item.image.alt}
                fill
                sizes="(max-width: 767px) 70vw, (max-width: 1280px) 38vw, 28vw"
                className={styles.image}
                draggable={false}
              />
            </button>
          ))}
        </div>
      </div>

      <Lightbox
        images={lightboxImages}
        initialIndex={lightbox.index}
        isOpen={lightbox.isOpen}
        onClose={lightbox.close}
      />
    </>
  )
}
