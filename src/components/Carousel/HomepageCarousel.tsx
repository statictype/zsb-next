'use client'

import { homepageCarousel } from '@/components/Carousel/HomepageCarousel.recipe'
import { LightboxCarousel } from '@/components/Carousel/LightboxCarousel'
import { Figure } from '@/components/Figure/Figure'
import type { HeroImage } from '@/types/edition'

export function HomepageCarousel({ images }: { images: HeroImage[] }) {
  const styles = homepageCarousel()

  return (
    <LightboxCarousel
      id="homepage-hero"
      label="Homepage photography"
      mode="stage"
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
                sizes="(min-width: 1024px) 940px, (min-width: 768px) 70vw, 100vw"
                preload={index === 0}
                className={styles.image}
                style={image.position ? { objectPosition: image.position } : undefined}
                draggable={false}
              />
            </button>
          ),
        }))
      }
    />
  )
}
