'use client'

import { STAGE_SIZES } from '@/components/Carousel/carousel-contract'
import { homepageCarousel } from '@/components/Carousel/HomepageCarousel.recipe'
import { LightboxGallery } from '@/components/Carousel/LightboxGallery'
import { SlideFigure } from '@/components/Carousel/SlideFigure'
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
      renderSlide={(image, trigger, index, loading) => (
        <Button
          variant="plain"
          className={styles.slide}
          aria-label="Open image in lightbox"
          {...trigger(0)}
        >
          <SlideFigure
            loading={loading}
            image={image}
            sizes={STAGE_SIZES}
            preload={index === 0}
            fetchPriority={index === 0 ? 'high' : 'auto'}
            className={styles.image}
            style={image.position ? { objectPosition: image.position } : undefined}
            draggable={false}
          />
        </Button>
      )}
    />
  )
}
