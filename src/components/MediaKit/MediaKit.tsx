'use client'

import Image from 'next/image'
import { Lightbox } from '@/components/Lightbox/Lightbox'
import shared from '@/components/Shared.module.css'
import { imageSrc } from '@/lib/image-utils'
import { useLightbox } from '@/lib/use-lightbox'
import type { MediaKitItem } from '@/types/edition'
import styles from './MediaKit.module.css'

interface MediaKitProps {
  items: MediaKitItem[]
}

export function MediaKit({ items }: MediaKitProps) {
  const lightbox = useLightbox()

  const lightboxImages = items.map((item) => ({
    src: `${item.image.basePath}-1920.webp`,
    caption: item.name,
  }))

  return (
    <>
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.header}>
            <div className={styles.headerLeft}>
              <h2 className={`${shared.sectionTitle} ${styles.title}`}>
                Media Kit
              </h2>
            </div>
            <span className={styles.count}>{items.length} Items</span>
          </div>

          <div className={styles.grid}>
            {items.map((item, i) => (
              // biome-ignore lint/a11y/useSemanticElements: grid layout container with complex children
              <div
                key={i}
                role="button"
                tabIndex={0}
                className={styles.card}
                onClick={() => lightbox.open(i)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    lightbox.open(i)
                  }
                }}
              >
                <span className={styles.cardIndex}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className={styles.cardInner}>
                  <Image
                    src={imageSrc(item.image)}
                    alt={item.image.alt}
                    fill
                    sizes="(max-width: 767px) 100vw, 50vw"
                    className={styles.cardImage}
                  />
                  <div className={styles.cardOverlay}>
                    <span className={styles.cardLabel}>{item.label}</span>
                    <h3 className={styles.cardName}>{item.name}</h3>
                    <div className={styles.cardAction}>
                      <span className={styles.cardActionIcon}>+</span>
                      <span>View Full</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Lightbox
        images={lightboxImages}
        initialIndex={lightbox.index}
        isOpen={lightbox.isOpen}
        onClose={lightbox.close}
      />
    </>
  )
}
