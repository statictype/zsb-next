'use client'

import { galleryCarousel } from '@/components/Carousel/GalleryCarousel.recipe'
import { LightboxCarousel } from '@/components/Carousel/LightboxCarousel'
import { Figure } from '@/components/Figure/Figure'
import type { CarouselLayout, CarouselSlide as GallerySlide } from '@/types/edition'

type GallerySize = 'default' | 'large'

const RAIL_VW: Record<GallerySize, { phone: number; desktop: number }> = {
  default: { phone: 92, desktop: 65 },
  large: { phone: 92, desktop: 78 },
}

function sizesFor(layout: CarouselLayout, imgIndex: number, size: GallerySize): string {
  const { phone, desktop } = RAIL_VW[size]
  const featured = (layout === 'featured-portrait' || layout === 'featured-stack') && imgIndex === 0
  const share = layout === 'full' ? 1 : featured ? 2 / 3 : layout === 'duo' ? 1 / 2 : 1 / 3
  const round = (vw: number) => Math.round(vw * share)
  return `(max-width: 767px) ${round(phone)}vw, ${round(desktop)}vw`
}

interface GalleryCarouselProps {
  slides: GallerySlide[]
  eyebrow: string
  treatment: 'mono' | 'color'
  size?: GallerySize
  className?: string | undefined
}

export function GalleryCarousel({
  slides,
  eyebrow,
  treatment,
  size = 'default',
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
      id="edition-gallery"
      label="Edition photo carousel"
      mode="rail"
      autoplay={false}
      loop={false}
      eyebrow={eyebrow}
      className={className}
      lightboxImages={lightboxImages}
      slides={(openLightbox) =>
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
                    onClick={() => openLightbox(imageFlatIndex)}
                  >
                    <Figure
                      image={image.image}
                      sizes={sizesFor(slide.layout, imageIndex, size)}
                      className={styles.itemImage}
                      draggable={false}
                    />
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
