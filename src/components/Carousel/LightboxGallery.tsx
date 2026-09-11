'use client'

import type { ReactNode } from 'react'
import { useCallback, useState } from 'react'
import { Carousel } from '@/components/Carousel/Carousel'
import { Lightbox, type LightboxImage } from '@/components/Lightbox/Lightbox'

export interface LightboxTrigger {
  ref: (element: HTMLElement | null) => void
  onClick: () => void
}

interface LightboxGalleryProps<T> {
  id?: string
  label: string
  mode: 'stage' | 'rail'
  eyebrow?: ReactNode
  className?: string | undefined
  slides: T[]
  lightboxImages: (slide: T) => LightboxImage[]
  renderSlide: (slide: T, trigger: (image: number) => LightboxTrigger, index: number) => ReactNode
}

export function LightboxGallery<T>({
  slides,
  lightboxImages,
  renderSlide,
  ...carouselProps
}: LightboxGalleryProps<T>) {
  const [open, setOpen] = useState(false)
  const [index, setIndex] = useState(0)
  const [origins] = useState(() => new Map<number, HTMLElement>())

  const getOrigin = useCallback((image: number) => origins.get(image) ?? null, [origins])

  const groups = slides.map((slide) => lightboxImages(slide))
  const starts = groups.map((_, slideIndex) => groups.slice(0, slideIndex).flat().length)

  const trigger = (image: number): LightboxTrigger => ({
    ref: (element) => {
      if (element) origins.set(image, element)
      else origins.delete(image)
    },
    onClick: () => {
      setIndex(image)
      setOpen(true)
    },
  })

  return (
    <>
      <Carousel
        {...carouselProps}
        slides={slides.map((slide, slideIndex) => ({
          id: String(slideIndex),
          content: renderSlide(
            slide,
            (image) => trigger((starts[slideIndex] ?? 0) + image),
            slideIndex,
          ),
        }))}
      />
      <Lightbox
        images={groups.flat()}
        open={open}
        index={index}
        getOrigin={getOrigin}
        onClose={() => setOpen(false)}
        onIndexChange={setIndex}
      />
    </>
  )
}
