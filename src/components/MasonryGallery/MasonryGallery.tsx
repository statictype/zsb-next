'use client'

import { Figure } from '@/components/Figure/Figure'
import { useLightbox } from '@/components/Lightbox/Lightbox'
import type { MasonryImage } from '@/types/edition'
import styles from './MasonryGallery.module.css'

interface MasonryGalleryProps {
  images: MasonryImage[]
}

export function MasonryGallery({ images }: MasonryGalleryProps) {
  const lightbox = useLightbox(images)

  return (
    <>
      <div className={styles.gallery}>
        {images.map((img, i) => (
          // biome-ignore lint/a11y/useSemanticElements: grid layout container with complex children
          <div
            key={img.src}
            role="button"
            tabIndex={0}
            className={styles.item}
            style={{
              gridColumn: `span ${img.cols}`,
              gridRow: `span ${img.rows}`,
            }}
            onClick={() => lightbox.open(i)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                lightbox.open(i)
              }
            }}
          >
            <Figure
              image={img}
              sizes={
                img.cols >= 2
                  ? '(max-width: 767px) 100vw, (max-width: 1023px) 66vw, 50vw'
                  : '(max-width: 767px) 50vw, (max-width: 1023px) 33vw, 25vw'
              }
              className={styles.image}
            />
            <div className={styles.overlay} />
          </div>
        ))}
      </div>

      {lightbox.element}
    </>
  )
}
