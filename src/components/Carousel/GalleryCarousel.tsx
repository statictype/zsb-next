'use client'

import { css } from 'styled-system/css'
import { Figure } from '@/components/Figure/Figure'
import { useLightbox } from '@/components/Lightbox/Lightbox'
import type { CarouselLayout, CarouselSlide as GallerySlide } from '@/types/edition'
import { Carousel } from './Carousel'
import { galleryCarousel } from './GalleryCarousel.recipe'

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
    slide.images.map((image) => ({ src: image.image.src, caption: image.caption })),
  )
  const lightbox = useLightbox(lightboxImages)
  const styles = galleryCarousel()
  const slideOffsets = slides.map((_, slideIndex) =>
    slides.slice(0, slideIndex).reduce((imageCount, slide) => imageCount + slide.images.length, 0),
  )

  const carouselSlides = slides.map((slide, slideIndex) => {
    const startIndex = slideOffsets[slideIndex] ?? 0
    const content = (
      <div className={galleryCarousel({ layout: slide.layout }).slide}>
        {slide.images.map((image, imageIndex) => {
          const imageFlatIndex = startIndex + imageIndex
          return (
            <div
              key={image.image.src}
              className={styles.item}
              role="button"
              tabIndex={0}
              onClick={() => lightbox.open(imageFlatIndex)}
              onKeyDown={(event) => {
                if (event.key !== 'Enter' && event.key !== ' ') return
                event.preventDefault()
                lightbox.open(imageFlatIndex)
              }}
            >
              <Figure
                image={image.image}
                sizes={sizesFor(slide.layout, imageIndex)}
                className={styles.itemImage}
                draggable={false}
              />
            </div>
          )
        })}
      </div>
    )
    return { id: `gallery-${slideIndex}`, content }
  })

  return (
    <>
      <Carousel
        id="edition-gallery"
        slides={carouselSlides}
        label="Edition photo carousel"
        mode="rail"
        autoplay={false}
        loop={false}
        eyebrow={eyebrow}
        className={placement}
      />
      {lightbox.element}
    </>
  )
}
