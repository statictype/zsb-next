import { RiArrowRightLine } from '@remixicon/react'
import Link from 'next/link'
import styles from './not-found.module.css'

export default function NotFound() {
  return (
    <div className={styles.page}>
      <div className={styles.noise} />
      <div className={styles.vignette} />
      <div className={`${styles.glow} ${styles.glowPink}`} />
      <div className={`${styles.glow} ${styles.glowChartreuse}`} />

      <div className={styles.content}>
        <div className={styles.code}>404</div>
        <div className={styles.divider} />
        <h1 className={styles.title}>This space is empty</h1>
        <p className={styles.subtitle}>Like an exhibition between shows</p>
        <Link href="/" className={styles.cta}>
          Return Home <RiArrowRightLine size={14} className={styles.ctaArrow} />
        </Link>
      </div>
    </div>
  )
}
