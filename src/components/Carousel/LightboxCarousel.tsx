'use client'

import type { ReactNode } from 'react'
import { useState } from 'react'
import { Lightbox, type LightboxImage } from '@/components/Lightbox/Lightbox'
import { Carousel, type CarouselSlide } from './Carousel'

interface LightboxCarouselProps {
  id?: string | undefined
  label: string
  mode: 'stage' | 'rail'
  autoplay?: false | number
  loop: boolean
  eyebrow?: ReactNode
  className?: string | undefined
  /** Flat list backing the lightbox; indices into it are handed to slides via
   *  the `openLightbox` callback passed into `slides`. */
  lightboxImages: LightboxImage[]
  /** Builds the carousel slides, given the callback that opens the lightbox
   *  at a given flat image index. */
  slides: (openLightbox: (index: number) => void) => CarouselSlide[]
}

/** Owns the one state (which lightbox image, if any, is open) and wiring
 *  shared by every Carousel that opens a Lightbox on slide click. */
export function LightboxCarousel({
  lightboxImages,
  slides,
  ...carouselProps
}: LightboxCarouselProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  return (
    <>
      <Carousel {...carouselProps} slides={slides(setLightboxIndex)} />
      <Lightbox
        images={lightboxImages}
        index={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onIndexChange={setLightboxIndex}
      />
    </>
  )
}
