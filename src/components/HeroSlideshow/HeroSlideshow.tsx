'use client'

import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'
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
  const timerRef = useRef<ReturnType<typeof setInterval>>(null)

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setActive((prev) => (prev + 1) % images.length)
    }, interval)
  }, [images.length, interval])

  useEffect(() => {
    startTimer()
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [startTimer])

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
