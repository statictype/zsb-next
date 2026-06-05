'use client'

import { RiArrowLeftLine, RiArrowRightLine } from '@remixicon/react'
import Image from 'next/image'
import { useLightbox } from '@/components/Lightbox/Lightbox'
import shared from '@/components/Shared.module.css'
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
  const { trackRef, activeIndex, registerItem, goPrev, goNext, trackProps, consumeDrag } =
    useScrollSnapStrip<HTMLButtonElement>({ count: items.length })

  const onCardClick = (e: React.MouseEvent, index: number) => {
    if (consumeDrag()) {
      e.preventDefault()
      return
    }
    lightbox.open(index)
  }

  return (
    <>
      <div className={styles.controls}>
        <div className={styles.eyebrow}>Media</div>
        <div className={styles.arrows}>
          <button
            type="button"
            className={styles.arrow}
            onClick={goPrev}
            disabled={activeIndex === 0}
            aria-label="Previous poster"
          >
            <RiArrowLeftLine size={20} />
          </button>
          <button
            type="button"
            className={styles.arrow}
            onClick={goNext}
            disabled={activeIndex === items.length - 1}
            aria-label="Next poster"
          >
            <RiArrowRightLine size={20} />
          </button>
        </div>
      </div>

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
              onClick={(e) => onCardClick(e, i)}
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
