'use client'

import { RiArrowLeftLine, RiArrowRightLine } from '@remixicon/react'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { imageSrc } from '@/lib/image-utils'
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
  const [active, setActive] = useState(0)
  const [resetKey, setResetKey] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setActive((prev) => (prev + 1) % images.length)
    }, interval)
    return () => clearInterval(id)
  }, [images.length, interval, resetKey])

  const goPrev = () => {
    setActive((p) => (p - 1 + images.length) % images.length)
    setResetKey((k) => k + 1)
  }

  const goNext = () => {
    setActive((p) => (p + 1) % images.length)
    setResetKey((k) => k + 1)
  }

  return (
    <div className={styles.slideshow}>
      <div className={styles.controls}>
        <button
          type="button"
          className={styles.control}
          onClick={goPrev}
          aria-label="Previous slide"
        >
          <RiArrowLeftLine size={18} />
        </button>
        <button
          type="button"
          className={styles.control}
          onClick={goNext}
          aria-label="Next slide"
        >
          <RiArrowRightLine size={18} />
        </button>
      </div>
      <div className={styles.stage}>
        {images.map((img, i) => (
          <div
            key={img.basePath}
            className={`${styles.slide} ${i === active ? styles.slideActive : ''}`}
          >
            <Image
              src={imageSrc(img)}
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
    </div>
  )
}
