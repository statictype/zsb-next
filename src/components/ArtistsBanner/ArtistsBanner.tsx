import { RiArrowRightUpLine } from '@remixicon/react'
import Link from 'next/link'
import { ALL_ARTISTS } from '@/data/artists'
import { getAllEditionYears } from '@/data/editions'
import styles from './ArtistsBanner.module.css'

export function ArtistsBanner() {
  const artistCount = ALL_ARTISTS.length
  const editionCount = getAllEditionYears().length

  return (
    <Link href="/artists" className={styles.banner}>
      <div className={styles.inner}>
        <div className={styles.left}>
          <span className={styles.tag}>Index</span>
          <h2 className={styles.title}>Artists</h2>
          <p className={styles.subtext}>
            {artistCount} artists. {editionCount} editions. One sustained question: what sculpture
            makes visible that nothing else can.
          </p>
        </div>
        <div className={styles.cta}>
          <span className={styles.ctaText}>Explore</span>
          <span className={styles.arrow}>
            <RiArrowRightUpLine size={28} />
          </span>
        </div>
      </div>
      <div className={styles.accent} />
    </Link>
  )
}
