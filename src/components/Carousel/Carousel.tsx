'use client'

import { RiArrowLeftLine, RiArrowRightLine } from '@remixicon/react'
import Image from 'next/image'
import { useCallback, useRef, useState } from 'react'
import sharedStyles from '@/components/Shared.module.css'
import { imageSrc } from '@/lib/image-utils'
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

export function Carousel({ slides, theme }: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const touchStartX = useRef(0)
  const totalSlides = slides.length

  const goTo = useCallback(
    (index: number) => {
      if (index >= 0 && index < totalSlides) {
        setCurrentIndex(index)
      }
    },
    [totalSlides],
  )

  const goPrev = useCallback(() => {
    goTo(currentIndex - 1)
  }, [currentIndex, goTo])

  const goNext = useCallback(() => {
    goTo(currentIndex + 1)
  }, [currentIndex, goTo])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowLeft') goTo(currentIndex - 1)
      if (e.key === 'ArrowRight') goTo(currentIndex + 1)
    },
    [currentIndex, goTo],
  )

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.changedTouches[0]
    if (touch) touchStartX.current = touch.screenX
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touch = e.changedTouches[0]
    if (!touch) return
    const diff = touchStartX.current - touch.screenX
    if (Math.abs(diff) > 50) {
      if (diff > 0 && currentIndex < totalSlides - 1) {
        goNext()
      } else if (diff < 0 && currentIndex > 0) {
        goPrev()
      }
    }
  }

  const progressPercent = ((currentIndex + 1) / totalSlides) * 100

  return (
    <section className={styles.section}>
      {/* Header */}
      <div className={styles.header}>
        <h2 className={`${sharedStyles.sectionTitle} ${styles.title}`}>
          Experience
        </h2>
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
              <div
                key={slideIndex}
                className={`${styles.slide} ${LAYOUT_MAP[slide.layout] || ''}`}
              >
                {slide.images.map((img, imgIndex) => (
                  <div key={imgIndex} className={styles.item}>
                    <Image
                      src={imageSrc(img.image)}
                      alt={img.image.alt}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className={styles.itemImage}
                    />
                    <div className={styles.itemOverlay}>
                      <div className={styles.itemInfo}>
                        <div className={styles.itemCaption}>{img.caption}</div>
                      </div>
                    </div>
                  </div>
                ))}
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
              onClick={goPrev}
              disabled={currentIndex === 0}
              aria-label="Previous slide"
            >
              <RiArrowLeftLine size={24} />
            </button>
            <button
              type="button"
              className={styles.btn}
              onClick={goNext}
              disabled={currentIndex === totalSlides - 1}
              aria-label="Next slide"
            >
              <RiArrowRightLine size={24} />
            </button>
          </div>

          <div className={styles.progressWrap}>
            <div className={styles.progress}>
              <div
                className={styles.progressBar}
                style={{ width: `${progressPercent}%` }}
              />
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
    </section>
  )
}
