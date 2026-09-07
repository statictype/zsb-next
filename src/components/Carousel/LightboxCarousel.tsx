'use client'

import type { ReactNode } from 'react'
import { useCallback, useState } from 'react'
import { Carousel, type CarouselSlide } from '@/components/Carousel/Carousel'
import { Lightbox, type LightboxImage } from '@/components/Lightbox/Lightbox'

interface LightboxCarouselProps {
  id?: string
  label: string
  mode: 'stage' | 'rail'
  loop: boolean
  eyebrow?: ReactNode
  className?: string | undefined
  /** Flat list backing the lightbox; indices into it are handed to slides via
   *  the `openLightbox` callback passed into `slides`. */
  lightboxImages: LightboxImage[]
  /** Builds the carousel slides, given the callback that opens the lightbox
   *  at a given flat image index and the ref callback that records which
   *  element that index flies out of. */
  slides: (
    openLightbox: (index: number) => void,
    registerOrigin: (index: number, element: HTMLElement | null) => void,
  ) => CarouselSlide[]
}

/** Owns the one state (which lightbox image, if any, is open) and wiring
 *  shared by every Carousel that opens a Lightbox on slide click. */
export function LightboxCarousel({
  lightboxImages,
  slides,
  ...carouselProps
}: LightboxCarouselProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [origins] = useState(() => new Map<number, HTMLElement>())

  const registerOrigin = useCallback(
    (index: number, element: HTMLElement | null) => {
      if (element) origins.set(index, element)
      else origins.delete(index)
    },
    [origins],
  )

  const getOrigin = useCallback((index: number) => origins.get(index) ?? null, [origins])

  return (
    <>
      <Carousel {...carouselProps} slides={slides(setLightboxIndex, registerOrigin)} />
      <Lightbox
        images={lightboxImages}
        index={lightboxIndex}
        getOrigin={getOrigin}
        onClose={() => setLightboxIndex(null)}
        onIndexChange={setLightboxIndex}
      />
    </>
  )
}
