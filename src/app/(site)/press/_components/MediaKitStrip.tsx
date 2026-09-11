'use client'

import { mediaKitStrip } from '@site/press/_components/MediaKitStrip.recipe'
import { LightboxGallery } from '@/components/Carousel/LightboxGallery'
import { Figure } from '@/components/Figure/Figure'
import { Button } from '@/components/ui/Button/Button'
import type { MediaKitStripItem } from '@/types/edition'

interface MediaKitStripProps {
  items: MediaKitStripItem[]
}

export function MediaKitStrip({ items }: MediaKitStripProps) {
  const s = mediaKitStrip()

  return (
    <LightboxGallery
      id="media-kit-posters"
      label="Media kit posters"
      mode="rail"
      eyebrow="Media"
      slides={items}
      lightboxImages={(item) => [{ image: item.image, caption: `${item.year} · ${item.name}` }]}
      renderSlide={(item, trigger) => (
        <Button
          variant="plain"
          className={s.card}
          aria-label={`Open ${item.year} ${item.name}`}
          {...trigger(0)}
        >
          <Figure
            image={item.image}
            sizes="(max-width: 767px) 70vw, (max-width: 1280px) 38vw, 28vw"
            className={s.image}
            draggable={false}
          />
        </Button>
      )}
    />
  )
}
