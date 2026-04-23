'use client'

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

  useEffect(() => {
    const id = setInterval(() => {
      setActive((prev) => (prev + 1) % images.length)
    }, interval)
    return () => clearInterval(id)
  }, [images.length, interval])

  return (
    <div className={styles.slideshow}>
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
  )
}
