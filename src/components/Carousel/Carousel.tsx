'use client'

import { RiArrowLeftLine, RiArrowRightLine } from '@remixicon/react'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { useLightbox } from '@/components/Lightbox/Lightbox'
import type { CarouselLayout, CarouselSlide } from '@/types/edition'
import styles from './Carousel.module.css'

interface CarouselProps {
  slides: CarouselSlide[]
  eyebrow: string
}

const LAYOUT_MAP: Record<CarouselLayout, string | undefined> = {
  trio: styles.layoutTrio,
  duo: styles.layoutDuo,
  'featured-portrait': styles.layoutFeaturedPortrait,
  'featured-stack': styles.layoutFeaturedStack,
  full: styles.layoutFull,
}

function sizesFor(layout: CarouselLayout, imgIndex: number): string {
  if (layout === 'full') return '(max-width: 767px) 92vw, 65vw'
  const isFeaturedLarge =
    (layout === 'featured-portrait' || layout === 'featured-stack') && imgIndex === 0
  if (isFeaturedLarge) return '(max-width: 767px) 61vw, 43vw'
  if (layout === 'duo') return '(max-width: 767px) 46vw, 33vw'
  return '(max-width: 767px) 30vw, 22vw'
}

export function Carousel({ slides, eyebrow }: CarouselProps) {
  // Flatten all slide images into a single lightbox sequence and remember
  // each item's flat index so clicks open the right one.
  const lightboxImages: { src: string; caption: string }[] = []
  const flatIndices: number[][] = []
  for (const slide of slides) {
    const indices: number[] = []
    for (const img of slide.images) {
      indices.push(lightboxImages.length)
      lightboxImages.push({ src: img.image.src, caption: img.caption })
    }
    flatIndices.push(indices)
  }
  const lightbox = useLightbox(lightboxImages)

  const trackRef = useRef<HTMLDivElement>(null)
  const slideRefs = useRef<(HTMLDivElement | null)[]>([])
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    const onScroll = () => {
      const trackRect = track.getBoundingClientRect()
      let nearest = 0
      let minDist = Number.POSITIVE_INFINITY
      slideRefs.current.forEach((slide, i) => {
        if (!slide) return
        const rect = slide.getBoundingClientRect()
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

  const scrollToSlide = (index: number) => {
    const slide = slideRefs.current[index]
    const track = trackRef.current
    if (!slide || !track) return
    track.scrollTo({
      left: slide.offsetLeft - track.offsetLeft,
      behavior: 'smooth',
    })
  }

  const goPrev = () => scrollToSlide(Math.max(0, activeIndex - 1))
  const goNext = () => scrollToSlide(Math.min(slides.length - 1, activeIndex + 1))

  // ---- Mouse drag-to-scroll ----
  const dragRef = useRef<{
    pointerId: number
    startX: number
    startScroll: number
    moved: boolean
  } | null>(null)

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'touch') return
    if (e.button !== 0) return
    const track = trackRef.current
    if (!track) return
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

      // Pick the slide nearest the current scroll position.
      const findNearest = (target: number) => {
        let nearest = 0
        let minDist = Number.POSITIVE_INFINITY
        slideRefs.current.forEach((slide, i) => {
          if (!slide) return
          const offset = slide.offsetLeft - track.offsetLeft
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
      // next slide in the drag direction, so a half-hearted drag doesn't bounce
      // back to where it started.
      const delta = track.scrollLeft - drag.startScroll
      const swipeThreshold = 50
      if (targetIndex === startIndex && Math.abs(delta) > swipeThreshold) {
        const direction = delta > 0 ? 1 : -1
        targetIndex = Math.max(0, Math.min(slides.length - 1, startIndex + direction))
      }

      const target = slideRefs.current[targetIndex]
      if (target) {
        track.scrollTo({
          left: target.offsetLeft - track.offsetLeft,
          behavior: 'smooth',
        })
      }
    }
  }

  const onItemClick = (e: React.MouseEvent, flatIndex: number) => {
    const wasDrag = dragRef.current?.moved
    dragRef.current = null
    if (wasDrag) {
      e.preventDefault()
      return
    }
    lightbox.open(flatIndex)
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

  return (
    <>
      <div className={styles.controls}>
        <div className={styles.eyebrow}>{eyebrow}</div>
        <div className={styles.arrows}>
          <button
            type="button"
            className={styles.arrow}
            onClick={goPrev}
            disabled={activeIndex === 0}
            aria-label="Previous slide"
          >
            <RiArrowLeftLine size={20} />
          </button>
          <button
            type="button"
            className={styles.arrow}
            onClick={goNext}
            disabled={activeIndex === slides.length - 1}
            aria-label="Next slide"
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
          aria-label="Edition photo carousel"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onKeyDown={onKeyDown}
        >
          {slides.map((slide, slideIndex) => (
            <div
              key={slideIndex}
              ref={(el) => {
                slideRefs.current[slideIndex] = el
              }}
              className={`${styles.slide} ${LAYOUT_MAP[slide.layout] || ''}`}
            >
              {slide.images.map((img, imgIndex) => {
                const flatIndex = flatIndices[slideIndex]?.[imgIndex] ?? 0
                return (
                  <div
                    key={imgIndex}
                    className={styles.item}
                    role="button"
                    tabIndex={0}
                    onClick={(e) => onItemClick(e, flatIndex)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        lightbox.open(flatIndex)
                      }
                    }}
                  >
                    <Image
                      src={img.image.src}
                      alt={img.image.alt}
                      fill
                      sizes={sizesFor(slide.layout, imgIndex)}
                      style={{ objectFit: 'cover' }}
                      className={styles.itemImage}
                      draggable={false}
                    />
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>

      {lightbox.element}
    </>
  )
}
