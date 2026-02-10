'use client'

import Image from 'next/image'
import { useState } from 'react'
import { Lightbox } from '@/components/Lightbox/Lightbox'
import styles from './MasonryGallery.module.css'

export interface MasonryImage {
  basePath: string
  alt: string
  caption: string
  cols: number
  rows: number
}

interface MasonryGalleryProps {
  images: MasonryImage[]
}

export function MasonryGallery({ images }: MasonryGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  const lightboxImages = images.map((img) => ({
    src: `${img.basePath}-1920.webp`,
    caption: img.caption,
  }))

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
            onClick={() => {
              setLightboxIndex(i)
              setLightboxOpen(true)
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                setLightboxIndex(i)
                setLightboxOpen(true)
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
        initialIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />
    </>
  )
}
