'use client'

import { RiArrowLeftLine, RiArrowRightLine } from '@remixicon/react'
import Image from 'next/image'
import { useLightbox } from '@/components/Lightbox/Lightbox'
import shared from '@/components/Shared.module.css'
import { useSlideshow } from '@/lib/use-slideshow'
import type { ImageData } from '@/types/edition'
import styles from './HeroSlideshow.module.css'

export interface HeroImage extends ImageData {
  /** CSS object-position value, e.g. "top", "center", "bottom" */
  position?: string
}

interface HeroSlideshowProps {
  images: HeroImage[]
  interval?: number
}

export function HeroSlideshow({ images, interval = 5000 }: HeroSlideshowProps) {
  const { index: active, next, prev } = useSlideshow({
    count: images.length,
    wrap: true,
    autoplay: interval,
  })
  const lightbox = useLightbox(images.map((img) => ({ src: img.src, caption: '' })))

  return (
    <div className={styles.slideshow}>
      <div className={styles.controls}>
        <button
          type="button"
          className={styles.control}
          onClick={prev}
          aria-label="Previous slide"
        >
          <RiArrowLeftLine size={18} />
        </button>
        <button type="button" className={styles.control} onClick={next} aria-label="Next slide">
          <RiArrowRightLine size={18} />
        </button>
      </div>
      <div
        className={styles.stage}
        role="button"
        tabIndex={0}
        aria-label="Open image in lightbox"
        onClick={() => lightbox.open(active)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            lightbox.open(active)
          }
        }}
      >
        {images.map((img, i) => (
          <div
            key={img.src}
            className={`${styles.slide} ${i === active ? styles.slideActive : ''}`}
          >
            <span aria-hidden className={shared.skeleton} />
            <Image
              src={img.src}
              alt={img.alt}
              fill
              sizes="100vw"
              priority={i === 0}
              style={img.position ? { objectPosition: img.position } : undefined}
            />
          </div>
        ))}
        <div className={styles.vignette} />
      </div>

      {lightbox.element}
    </div>
  )
}
