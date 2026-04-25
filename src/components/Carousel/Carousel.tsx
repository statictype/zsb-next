'use client'

import { RiArrowLeftLine, RiArrowRightLine } from '@remixicon/react'
import Image from 'next/image'
import { useRef, useState } from 'react'
import { Lightbox } from '@/components/Lightbox/Lightbox'
import sharedStyles from '@/components/Shared.module.css'
import { useLightbox } from '@/lib/use-lightbox'
import type { CarouselLayout, CarouselSlide } from '@/types/edition'
import styles from './Carousel.module.css'

interface CarouselProps {
  slides: CarouselSlide[]
  theme: string
}

const LAYOUT_MAP: Record<CarouselLayout, string | undefined> = {
  trio: styles.layoutTrio,
  duo: styles.layoutDuo,
  'featured-portrait': styles.layoutFeaturedPortrait,
  'featured-stack': styles.layoutFeaturedStack,
  full: styles.layoutFull,
}

function sizesFor(layout: CarouselLayout, imgIndex: number): string {
  if (layout === 'full') return '100vw'
  const isFeaturedLarge =
    (layout === 'featured-portrait' || layout === 'featured-stack') && imgIndex === 0
  if (isFeaturedLarge) return '(max-width: 767px) 100vw, 66vw'
  if (layout === 'duo') return '(max-width: 767px) 100vw, 50vw'
  return '(max-width: 767px) 100vw, 33vw'
}

export function Carousel({ slides, theme }: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const touchStartX = useRef(0)
  const totalSlides = slides.length
  const lightbox = useLightbox()

  // Flatten all slide images into a single lightbox sequence and
  // remember each item's flat index so clicks open the right one.
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

  function goTo(index: number) {
    if (index >= 0 && index < totalSlides) {
      setCurrentIndex(index)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'ArrowLeft') goTo(currentIndex - 1)
    if (e.key === 'ArrowRight') goTo(currentIndex + 1)
  }

  function handleTouchStart(e: React.TouchEvent) {
    const touch = e.changedTouches[0]
    if (touch) touchStartX.current = touch.screenX
  }

  function handleTouchEnd(e: React.TouchEvent) {
    const touch = e.changedTouches[0]
    if (!touch) return
    const diff = touchStartX.current - touch.screenX
    if (Math.abs(diff) > 50) {
      if (diff > 0) goTo(currentIndex + 1)
      else goTo(currentIndex - 1)
    }
  }

  const progressPercent = ((currentIndex + 1) / totalSlides) * 100

  return (
    <section className={`${sharedStyles.section} ${sharedStyles.sectionDark} ${styles.section}`}>
      {/* Header */}
      <div className={styles.header}>
        <h2 className={sharedStyles.sectionTitle}>Experience</h2>
        <div className={styles.count}>{theme}</div>
      </div>

      {/* Carousel */}
      {/* biome-ignore lint/a11y/useSemanticElements: nested section would be invalid, region role is intentional */}
      <div
        className={styles.carousel}
        role="region"
        aria-label="Image carousel"
        tabIndex={0}
        onKeyDown={handleKeyDown}
      >
        <div className={styles.viewport}>
          <div
            className={styles.track}
            style={{
              transform: `translateX(-${currentIndex * 100}%)`,
            }}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {slides.map((slide, slideIndex) => (
              <div key={slideIndex} className={`${styles.slide} ${LAYOUT_MAP[slide.layout] || ''}`}>
                {slide.images.map((img, imgIndex) => {
                  const flatIndex = flatIndices[slideIndex]?.[imgIndex] ?? 0
                  return (
                    <div
                      key={imgIndex}
                      className={styles.item}
                      role="button"
                      tabIndex={0}
                      onClick={() => lightbox.open(flatIndex)}
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
                      />
                      <div className={styles.itemOverlay}>
                        <div className={styles.itemInfo}>
                          <div className={styles.itemCaption}>{img.caption}</div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className={styles.controls}>
          <div className={styles.nav}>
            <button
              type="button"
              className={styles.btn}
              onClick={() => goTo(currentIndex - 1)}
              disabled={currentIndex === 0}
              aria-label="Previous slide"
            >
              <RiArrowLeftLine size={24} />
            </button>
            <button
              type="button"
              className={styles.btn}
              onClick={() => goTo(currentIndex + 1)}
              disabled={currentIndex === totalSlides - 1}
              aria-label="Next slide"
            >
              <RiArrowRightLine size={24} />
            </button>
          </div>

          <div className={styles.progressWrap}>
            <div className={styles.progress}>
              <div className={styles.progressBar} style={{ width: `${progressPercent}%` }} />
            </div>
          </div>

          <div className={styles.dots}>
            {slides.map((_, i) => (
              <button
                type="button"
                key={i}
                className={`${styles.dot} ${i === currentIndex ? styles.dotActive : ''}`}
                onClick={() => goTo(i)}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      <Lightbox
        images={lightboxImages}
        currentIndex={lightbox.index}
        onIndexChange={lightbox.setIndex}
        isOpen={lightbox.isOpen}
        onClose={lightbox.close}
      />
    </section>
  )
}
