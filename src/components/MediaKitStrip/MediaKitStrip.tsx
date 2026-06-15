'use client'

import { Figure } from '@/components/Figure/Figure'
import { useLightbox } from '@/components/Lightbox/Lightbox'
import { StripControls } from '@/components/StripControls/StripControls'
import { strip as stripRecipe } from '@/components/StripControls/strip.recipe'
import { useScrollSnapStrip } from '@/lib/use-scroll-snap-strip'
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
  const { trackRef, activeIndex, registerItem, goPrev, goNext, trackProps, guardClick } =
    useScrollSnapStrip<HTMLButtonElement>({ count: items.length })

  const s = mediaKitStrip()
  const strip = stripRecipe()

  return (
    <>
      <StripControls
        eyebrow="Media"
        activeIndex={activeIndex}
        count={items.length}
        onPrev={goPrev}
        onNext={goNext}
        labels={{ prev: 'Previous poster', next: 'Next poster' }}
      />

      <div className={strip.viewport}>
        <div
          ref={trackRef}
          className={strip.track}
          tabIndex={0}
          role="region"
          aria-label="Media kit posters"
          {...trackProps}
        >
          {items.map((item, i) => (
            <button
              key={`${item.year}-${i}`}
              ref={registerItem(i)}
              type="button"
              className={s.card}
              onClick={guardClick(() => lightbox.open(i))}
              aria-label={`Open ${item.year} ${item.name}`}
            >
              <Figure
                image={item.image}
                sizes="(max-width: 767px) 70vw, (max-width: 1280px) 38vw, 28vw"
                className={s.image}
                draggable={false}
              />
            </button>
          ))}
        </div>
      </div>

      {lightbox.element}
    </>
  )
}
