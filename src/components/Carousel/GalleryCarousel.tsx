'use client'

import { css } from 'styled-system/css'
import { galleryCarousel } from '@/components/Carousel/GalleryCarousel.recipe'
import { LightboxCarousel } from '@/components/Carousel/LightboxCarousel'
import { Figure } from '@/components/Figure/Figure'
import type { CarouselLayout, CarouselSlide as GallerySlide } from '@/types/edition'

const placement = css({ marginTop: '3xl' })

function sizesFor(layout: CarouselLayout, imgIndex: number): string {
  if (layout === 'full') return '(max-width: 767px) 92vw, 65vw'
  const featured = (layout === 'featured-portrait' || layout === 'featured-stack') && imgIndex === 0
  if (featured) return '(max-width: 767px) 61vw, 43vw'
  if (layout === 'duo') return '(max-width: 767px) 46vw, 33vw'
  return '(max-width: 767px) 30vw, 22vw'
}

export function GalleryCarousel({ slides, eyebrow }: { slides: GallerySlide[]; eyebrow: string }) {
  const lightboxImages = slides.flatMap((slide) =>
    slide.images.map((image) => ({ image: image.image, caption: image.caption })),
  )
  const styles = galleryCarousel()
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
      className={placement}
      lightboxImages={lightboxImages}
      slides={(openLightbox) =>
        slides.map((slide, slideIndex) => {
          const startIndex = slideOffsets[slideIndex] ?? 0
          const content = (
            <div className={galleryCarousel({ layout: slide.layout }).slide}>
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
                      sizes={sizesFor(slide.layout, imageIndex)}
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
