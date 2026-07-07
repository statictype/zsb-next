'use client'

import { useState } from 'react'
import { Figure } from '@/components/Figure/Figure'
import { Lightbox } from '@/components/Lightbox/Lightbox'
import type { HeroImage } from '@/types/edition'
import { Carousel } from './Carousel'
import { homepageCarousel } from './HomepageCarousel.recipe'

export function HomepageCarousel({
  images,
  interval = 5000,
}: {
  images: HeroImage[]
  interval?: number
}) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const styles = homepageCarousel()
  const slides = images.map((image, index) => ({
    id: `homepage-${index}`,
    content: (
      <button
        type="button"
        className={styles.slide}
        aria-label="Open image in lightbox"
        onClick={() => setLightboxIndex(index)}
      >
        <Figure
          image={image}
          sizes="(min-width: 1792px) 1024px, (min-width: 1280px) 60vw, 100vw"
          priority={index === 0}
          className={styles.image}
          style={image.position ? { objectPosition: image.position } : undefined}
          draggable={false}
        />
        <div className={styles.vignette} aria-hidden />
      </button>
    ),
  }))

  return (
    <>
      <Carousel
        id="homepage-hero"
        slides={slides}
        label="Homepage photography"
        mode="stage"
        autoplay={interval}
        loop
      />
      <Lightbox
        images={images.map((image) => ({ src: image.src, caption: '' }))}
        index={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onIndexChange={setLightboxIndex}
      />
    </>
  )
}
