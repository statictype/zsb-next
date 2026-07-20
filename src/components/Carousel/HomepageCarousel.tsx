'use client'

import { homepageCarousel } from '@/components/Carousel/HomepageCarousel.recipe'
import { LightboxCarousel } from '@/components/Carousel/LightboxCarousel'
import { Figure } from '@/components/Figure/Figure'
import type { HeroImage } from '@/types/edition'

export function HomepageCarousel({
  images,
  interval = 5000,
}: {
  images: HeroImage[]
  interval?: number
}) {
  const styles = homepageCarousel()

  return (
    <LightboxCarousel
      id="homepage-hero"
      label="Homepage photography"
      mode="stage"
      autoplay={interval}
      loop
      lightboxImages={images.map((image) => ({ image }))}
      slides={(openLightbox) =>
        images.map((image, index) => ({
          id: `homepage-${index}`,
          content: (
            <button
              type="button"
              className={styles.slide}
              aria-label="Open image in lightbox"
              onClick={() => openLightbox(index)}
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
      }
    />
  )
}
