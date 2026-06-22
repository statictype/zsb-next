'use client'

import { Carousel } from '@/components/Carousel/Carousel'
import { Figure } from '@/components/Figure/Figure'
import { useLightbox } from '@/components/Lightbox/Lightbox'
import { Button } from '@/components/ui/Button/Button'
import type { MediaKitStripItem } from '@/types/edition'
import { mediaKitStrip } from './MediaKitStrip.recipe'

interface MediaKitStripProps {
  items: MediaKitStripItem[]
}

export function MediaKitStrip({ items }: MediaKitStripProps) {
  const lightbox = useLightbox(
    items.map((item) => ({
      src: item.image.src,
      caption: `${item.year} · ${item.name}`,
    })),
  )
  const s = mediaKitStrip()

  return (
    <>
      <Carousel
        id="media-kit-posters"
        label="Media kit posters"
        mode="rail"
        autoplay={false}
        loop={false}
        eyebrow="Media"
        slides={items.map((item, index) => ({
          id: `media-kit-${index}`,
          content: (
            <Button
              variant="secondary"
              className={s.card}
              onClick={() => lightbox.open(index)}
              aria-label={`Open ${item.year} ${item.name}`}
            >
              <Figure
                image={item.image}
                sizes="(max-width: 767px) 70vw, (max-width: 1280px) 38vw, 28vw"
                className={s.image}
                draggable={false}
              />
            </Button>
          ),
        }))}
      />

      {lightbox.element}
    </>
  )
}
