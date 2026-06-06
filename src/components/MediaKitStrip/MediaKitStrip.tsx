'use client'

import Image from 'next/image'
import { useLightbox } from '@/components/Lightbox/Lightbox'
import shared from '@/components/Shared.module.css'
import { StripControls } from '@/components/StripControls/StripControls'
import { useScrollSnapStrip } from '@/lib/use-scroll-snap-strip'
import type { MediaKitItem } from '@/types/edition'
import styles from './MediaKitStrip.module.css'

export interface MediaKitStripItem extends MediaKitItem {
  year: number
  blurDataURL?: string
}

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

      <div className={styles.viewport}>
        <div
          ref={trackRef}
          className={styles.track}
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
              className={styles.card}
              onClick={guardClick(() => lightbox.open(i))}
              aria-label={`Open ${item.year} ${item.name}`}
            >
              <span aria-hidden className={shared.skeleton} />
              <Image
                src={item.image.src}
                alt={item.image.alt}
                fill
                sizes="(max-width: 767px) 70vw, (max-width: 1280px) 38vw, 28vw"
                className={styles.image}
                draggable={false}
                {...(item.blurDataURL
                  ? { placeholder: 'blur' as const, blurDataURL: item.blurDataURL }
                  : {})}
              />
            </button>
          ))}
        </div>
      </div>

      {lightbox.element}
    </>
  )
}
