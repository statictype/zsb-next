'use client'

import { RiArrowLeftLine, RiArrowRightLine } from '@remixicon/react'
import Image from 'next/image'
import { useLightbox } from '@/components/Lightbox/Lightbox'
import shared from '@/components/Shared.module.css'
import { useScrollSnapStrip } from '@/lib/use-scroll-snap-strip'
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

  const { trackRef, activeIndex, registerItem, goPrev, goNext, trackProps, consumeDrag } =
    useScrollSnapStrip<HTMLDivElement>({ count: slides.length })

  const onItemClick = (e: React.MouseEvent, flatIndex: number) => {
    if (consumeDrag()) {
      e.preventDefault()
      return
    }
    lightbox.open(flatIndex)
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
          {...trackProps}
        >
          {slides.map((slide, slideIndex) => (
            <div
              key={slideIndex}
              ref={registerItem(slideIndex)}
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
                    <span aria-hidden className={shared.skeleton} />
                    <Image
                      src={img.image.src}
                      alt={img.image.alt}
                      fill
                      sizes={sizesFor(slide.layout, imgIndex)}
                      style={{ objectFit: 'cover' }}
                      className={styles.itemImage}
                      draggable={false}
                      {...(img.image.blurDataURL
                        ? { placeholder: 'blur' as const, blurDataURL: img.image.blurDataURL }
                        : {})}
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
