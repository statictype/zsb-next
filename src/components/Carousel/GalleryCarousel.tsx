'use client'

import { SNAP_PAGE_ATTR } from '@/components/Carousel/carousel-contract'
import {
  galleryCarousel,
  SLIDE_BAND_KEYS,
  SLIDE_BANDS,
  type SlideBandKey,
  slideHeightCap,
} from '@/components/Carousel/GalleryCarousel.recipe'
import { LightboxGallery } from '@/components/Carousel/LightboxGallery'
import { SlideFigure } from '@/components/Carousel/SlideFigure'
import { Button } from '@/components/ui/Button/Button'
import { portraitPhoneQuery } from '@/design-system/tokens'
import type { CarouselLayout, CarouselSlide as GallerySlide } from '@/types/edition'

// Tracks the `_portraitPhone` cell width in GalleryCarousel.recipe.ts, where
// every image takes a page of its own instead of a share of `--slide-h`.
const PORTRAIT_PHONE_SIZE = `${portraitPhoneQuery} 82vw`

const STEPPED_BANDS = SLIDE_BAND_KEYS.filter((band) => band !== 'base').reverse()

function sizesFor(layout: CarouselLayout, imgIndex: number): string {
  const featured = (layout === 'featured-portrait' || layout === 'featured-stack') && imgIndex === 0
  const ratio = layout === 'full' || featured ? 1.5 : layout === 'duo' ? 1 : 0.75
  const cell = (band: SlideBandKey) => `${Math.ceil(slideHeightCap(band) * ratio)}px`
  const steps = STEPPED_BANDS.map(
    (band) => `(min-width: ${SLIDE_BANDS[band].minWidth}px) ${cell(band)}`,
  )
  return [PORTRAIT_PHONE_SIZE, ...steps, cell('base')].join(', ')
}

interface GalleryCarouselProps {
  id: string
  label: string
  slides: GallerySlide[]
  eyebrow?: string | undefined
  treatment: 'mono' | 'color'
  preload?: boolean
  className?: string | undefined
}

export function GalleryCarousel({
  id,
  label,
  slides,
  eyebrow,
  treatment,
  preload = false,
  className,
}: GalleryCarouselProps) {
  const styles = galleryCarousel({ treatment })

  return (
    <LightboxGallery
      id={id}
      label={label}
      mode="rail"
      eyebrow={eyebrow}
      className={className}
      slides={slides}
      lightboxImages={(slide) => slide.images}
      renderSlide={(slide, trigger, slideIndex, loading) => (
        <div className={galleryCarousel({ layout: slide.layout }).slide}>
          {slide.images.map((image, imageIndex) => (
            <Button
              key={image.image.src}
              variant="plain"
              className={styles.item}
              {...{ [SNAP_PAGE_ATTR]: '' }}
              {...trigger(imageIndex)}
            >
              <SlideFigure
                loading={loading}
                image={image.image}
                sizes={sizesFor(slide.layout, imageIndex)}
                className={styles.itemImage}
                draggable={false}
                preload={preload && slideIndex === 0 && imageIndex === 0}
              />
              {image.caption && (
                <span className={styles.caption} data-caption aria-hidden>
                  {image.caption}
                </span>
              )}
            </Button>
          ))}
        </div>
      )}
    />
  )
}
