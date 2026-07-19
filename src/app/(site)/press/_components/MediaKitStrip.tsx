'use client'

import { mediaKitStrip } from '@site/press/_components/MediaKitStrip.recipe'
import { LightboxCarousel } from '@/components/Carousel/LightboxCarousel'
import { Figure } from '@/components/Figure/Figure'
import { Button } from '@/components/ui/Button/Button'
import type { MediaKitStripItem } from '@/types/edition'

interface MediaKitStripProps {
  items: MediaKitStripItem[]
}

export function MediaKitStrip({ items }: MediaKitStripProps) {
  const s = mediaKitStrip()

  return (
    <LightboxCarousel
      id="media-kit-posters"
      label="Media kit posters"
      mode="rail"
      autoplay={false}
      loop={false}
      eyebrow="Media"
      lightboxImages={items.map((item) => ({
        src: item.image.src,
        caption: `${item.year} · ${item.name}`,
      }))}
      slides={(openLightbox) =>
        items.map((item, index) => ({
          id: `media-kit-${index}`,
          content: (
            <Button
              variant="secondary"
              className={s.card}
              onClick={() => openLightbox(index)}
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
        }))
      }
    />
  )
}
