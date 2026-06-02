import { RiArrowRightUpLine } from '@remixicon/react'
import Link from 'next/link'
import { getAllEditionYears } from '@/data/editions'
import { getArtistNames } from '@/sanity/lib/artists'
import styles from './ArtistsBanner.module.css'

export async function ArtistsBanner() {
  const [artists, editionYears] = await Promise.all([getArtistNames(), getAllEditionYears()])
  const artistCount = artists.length
  const editionCount = editionYears.length

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
