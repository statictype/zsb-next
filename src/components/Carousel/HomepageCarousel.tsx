'use client'

import { homepageCarousel } from '@/components/Carousel/HomepageCarousel.recipe'
import { LightboxGallery } from '@/components/Carousel/LightboxGallery'
import { Figure } from '@/components/Figure/Figure'
import { Button } from '@/components/ui/Button/Button'
import type { HeroImage } from '@/types/edition'

export function HomepageCarousel({ images }: { images: HeroImage[] }) {
  const styles = homepageCarousel()

  return (
    <LightboxGallery
      id="homepage-hero"
      label="Homepage photography"
      mode="stage"
      slides={images}
      lightboxImages={(image) => [{ image }]}
      renderSlide={(image, trigger, index) => (
        <Button
          variant="plain"
          className={styles.slide}
          aria-label="Open image in lightbox"
          {...trigger(0)}
        >
          <Figure
            image={image}
            sizes="(min-width: 1024px) 940px, (min-width: 768px) 70vw, 100vw"
            preload={index === 0}
            className={styles.image}
            style={image.position ? { objectPosition: image.position } : undefined}
            draggable={false}
          />
        </Button>
      )}
    />
  )
}
