'use client'

import { RiArrowLeftLine, RiArrowRightLine } from '@remixicon/react'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { useLightbox } from '@/components/Lightbox/Lightbox'
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
  const lightbox = useLightbox(
    items.map((item) => ({
      src: item.image.src,
      caption: `${item.year} · ${item.name}`,
    })),
  )
  const trackRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<(HTMLButtonElement | null)[]>([])
  const [activeIndex, setActiveIndex] = useState(0)

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

  const scrollToCard = (index: number) => {
    const card = cardRefs.current[index]
    const track = trackRef.current
    if (!card || !track) return
    track.scrollTo({
      left: card.offsetLeft - track.offsetLeft,
      behavior: 'smooth',
    })
  }

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
    // Don't capture or preventDefault yet — a plain click must reach the button's
    // onClick. We only commit to drag mode once movement crosses the threshold.
    dragRef.current = {
      pointerId: e.pointerId,
      startX: e.clientX,
      startScroll: track.scrollLeft,
      moved: false,
    }
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
    if (!drag.moved && Math.abs(dx) > 4) {
      // Threshold crossed: commit to drag mode.
      drag.moved = true
      track.setPointerCapture(e.pointerId)
      track.style.scrollBehavior = 'auto'
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
      track.style.cursor = ''
    }
    // Keep dragRef set so the upcoming click handler can read `.moved`.
  }

  const onCardClick = (e: React.MouseEvent, index: number) => {
    const wasDrag = dragRef.current?.moved
    dragRef.current = null
    if (wasDrag) {
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
                src={item.image.src}
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

      {lightbox.element}
    </>
  )
}
