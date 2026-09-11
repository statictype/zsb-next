'use client'

import { galleryCarousel } from '@/components/Carousel/GalleryCarousel.recipe'
import { LightboxGallery } from '@/components/Carousel/LightboxGallery'
import { Figure } from '@/components/Figure/Figure'
import { Button } from '@/components/ui/Button/Button'
import type { CarouselLayout, CarouselSlide as GallerySlide } from '@/types/edition'

type Band = 'base' | 'md' | 'lg' | 'xl' | '2xl' | '4xl'

// Ceiling of `--slide-h` per breakpoint band, derived from the `--slide-h-max`
// and `--slide-w-max` clamps in GalleryCarousel.recipe.ts; the layout column
// widths there are multiples of it.
const SLIDE_HEIGHT_CAP: Record<Band, number> = {
  base: 260,
  md: 374,
  lg: 449,
  xl: 469,
  '2xl': 572,
  '4xl': 780,
}

// Tracks the `_portraitPhone` cell width in GalleryCarousel.recipe.ts, where
// every image takes a page of its own instead of a share of `--slide-h`.
const PORTRAIT_PHONE_SIZE = '(max-width: 599.98px) and (orientation: portrait) 82vw'

const BAND_MIN_WIDTH: [Band, number][] = [
  ['4xl', 1792],
  ['2xl', 1440],
  ['xl', 1280],
  ['lg', 1024],
  ['md', 768],
]

function sizesFor(layout: CarouselLayout, imgIndex: number): string {
  const featured = (layout === 'featured-portrait' || layout === 'featured-stack') && imgIndex === 0
  const ratio = layout === 'full' || featured ? 1.5 : layout === 'duo' ? 1 : 0.75
  const cell = (band: Band) => `${Math.ceil(SLIDE_HEIGHT_CAP[band] * ratio)}px`
  const steps = BAND_MIN_WIDTH.map(([band, min]) => `(min-width: ${min}px) ${cell(band)}`)
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
      renderSlide={(slide, trigger, slideIndex) => (
        <div className={galleryCarousel({ layout: slide.layout }).slide}>
          {slide.images.map((image, imageIndex) => (
            <Button
              key={image.image.src}
              variant="plain"
              className={styles.item}
              data-carousel-snap
              {...trigger(imageIndex)}
            >
              <Figure
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
