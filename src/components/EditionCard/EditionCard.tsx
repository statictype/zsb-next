import { RiArrowRightLine } from '@remixicon/react'
import Image from 'next/image'
import Link from 'next/link'
import { imageSrc } from '@/lib/image-utils'
import type { EditionCardData } from '@/types/edition'
import styles from './EditionCard.module.css'

interface EditionCardProps {
  edition: EditionCardData
}

export function EditionCard({ edition }: EditionCardProps) {
  if (!('image' in edition)) {
    return (
      <div className={`${styles.card} ${styles.inactive}`}>
        <div className={styles.overlay} />
        <div className={styles.content}>
          <span className={styles.onlineBadge}>Online Edition</span>
          <div className={styles.year}>{edition.year}</div>
          <div className={styles.theme}>{edition.theme}</div>
          <p className={styles.desc}>{edition.description}</p>
        </div>
      </div>
    )
  }

  const variantClass = edition.variant
    ? styles[`variant${edition.variant.charAt(0).toUpperCase() + edition.variant.slice(1)}`]
    : ''

  return (
    <Link href={edition.href} className={`${styles.card} ${variantClass}`.trim()}>
      <div className={styles.imageWrap}>
        {edition.variant === 'tiled' ? (
          <div
            className={styles.tiledImage}
            style={{
              backgroundImage: `url(${edition.image.basePath}.${edition.image.ext})`,
            }}
          />
        ) : (
          <Image
            src={imageSrc(edition.image)}
            alt={edition.image.alt}
            fill
            sizes="(max-width: 1023px) 100vw, 50vw"
            className={styles.image}
          />
        )}
      </div>
      <div className={styles.overlay} />
      <div className={styles.content}>
        <div className={styles.year}>{edition.year}</div>
        <div className={styles.theme}>{edition.theme}</div>
        <p className={styles.desc}>{edition.description}</p>
        <span className={styles.cta}>
          View Edition <RiArrowRightLine size={16} />
        </span>
      </div>
    </Link>
  )
}
