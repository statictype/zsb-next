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
        <div className={styles.top}>
          <h2 className={styles.title}>Artists</h2>
          <span className={styles.arrow}>
            <RiArrowRightUpLine size={28} />
          </span>
        </div>
        <p className={styles.subtext}>
          {artistCount} across {editionCount} editions
        </p>
      </div>
    </Link>
  )
}
