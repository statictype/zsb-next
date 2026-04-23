'use client'

import Image from 'next/image'
import { Lightbox } from '@/components/Lightbox/Lightbox'
import { toLightboxImages } from '@/lib/format-utils'
import { useLightbox } from '@/lib/use-lightbox'
import type { MasonryImage } from '@/types/edition'
import styles from './MasonryGallery.module.css'

interface MasonryGalleryProps {
  images: MasonryImage[]
}

export function MasonryGallery({ images }: MasonryGalleryProps) {
  const lightbox = useLightbox()

  const lightboxImages = toLightboxImages(images)

  return (
    <>
      <div className={styles.gallery}>
        {images.map((img, i) => (
          // biome-ignore lint/a11y/useSemanticElements: grid layout container with complex children
          <div
            key={img.basePath}
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
            <Image
              src={img.basePath}
              alt={img.alt}
              fill
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

      <Lightbox
        images={lightboxImages}
        currentIndex={lightbox.index}
        onIndexChange={lightbox.setIndex}
        isOpen={lightbox.isOpen}
        onClose={lightbox.close}
      />
    </>
  )
}
