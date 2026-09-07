'use client'

import { galleryCarousel } from '@/components/Carousel/GalleryCarousel.recipe'
import { LightboxCarousel } from '@/components/Carousel/LightboxCarousel'
import { Figure } from '@/components/Figure/Figure'
import type { CarouselLayout, CarouselSlide as GallerySlide } from '@/types/edition'

type GallerySize = 'default' | 'large'

type Band = 'base' | 'md' | 'lg' | 'xl' | '2xl' | '4xl'

// Ceiling of `--slide-h` per breakpoint band, derived from the `--slide-h-max`
// and `--slide-w-max` clamps in GalleryCarousel.recipe.ts; the layout column
// widths there are multiples of it.
const SLIDE_HEIGHT_CAP: Record<GallerySize, Record<Band, number>> = {
  default: { base: 233, md: 351, lg: 398, xl: 379, '2xl': 452, '4xl': 560 },
  large: { base: 260, md: 374, lg: 449, xl: 469, '2xl': 572, '4xl': 780 },
}

const BAND_MIN_WIDTH: [Band, number][] = [
  ['4xl', 1792],
  ['2xl', 1440],
  ['xl', 1280],
  ['lg', 1024],
  ['md', 768],
]

function sizesFor(layout: CarouselLayout, imgIndex: number, size: GallerySize): string {
  const caps = SLIDE_HEIGHT_CAP[size]
  const featured = (layout === 'featured-portrait' || layout === 'featured-stack') && imgIndex === 0
  const ratio = layout === 'full' || featured ? 1.5 : layout === 'duo' ? 1 : 0.75
  const cell = (band: Band) => `${Math.ceil(caps[band] * ratio)}px`
  const steps = BAND_MIN_WIDTH.map(([band, min]) => `(min-width: ${min}px) ${cell(band)}`)
  return [...steps, cell('base')].join(', ')
}

interface GalleryCarouselProps {
  id: string
  label: string
  slides: GallerySlide[]
  eyebrow: string
  treatment: 'mono' | 'color'
  size?: GallerySize
  preload?: boolean
  className?: string | undefined
}

export function GalleryCarousel({
  id,
  label,
  slides,
  eyebrow,
  treatment,
  size = 'default',
  preload = false,
  className,
}: GalleryCarouselProps) {
  const lightboxImages = slides.flatMap((slide) =>
    slide.images.map((image) => ({ image: image.image, caption: image.caption })),
  )
  const styles = galleryCarousel({ treatment, size })
  const slideOffsets = slides.map((_, slideIndex) =>
    slides.slice(0, slideIndex).reduce((imageCount, slide) => imageCount + slide.images.length, 0),
  )

  return (
    <LightboxCarousel
      id={id}
      label={label}
      mode="rail"
      loop={false}
      eyebrow={eyebrow}
      className={className}
      lightboxImages={lightboxImages}
      slides={(openLightbox, registerOrigin) =>
        slides.map((slide, slideIndex) => {
          const startIndex = slideOffsets[slideIndex] ?? 0
          const content = (
            <div className={galleryCarousel({ layout: slide.layout, size }).slide}>
              {slide.images.map((image, imageIndex) => {
                const imageFlatIndex = startIndex + imageIndex
                return (
                  <button
                    key={image.image.src}
                    type="button"
                    className={styles.item}
                    ref={(element) => registerOrigin(imageFlatIndex, element)}
                    onClick={() => openLightbox(imageFlatIndex)}
                  >
                    <span className={styles.frame}>
                      <Figure
                        image={image.image}
                        sizes={sizesFor(slide.layout, imageIndex, size)}
                        className={styles.itemImage}
                        draggable={false}
                        preload={preload && imageFlatIndex === 0}
                      />
                    </span>
                    {image.caption && (
                      <span className={styles.caption} data-caption aria-hidden>
                        {image.caption}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          )
          return { id: `gallery-${slideIndex}`, content }
        })
      }
    />
  )
}
