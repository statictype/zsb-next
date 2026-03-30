import { ALL_ARTISTS } from '@/data/artists'
import styles from './ArtistsSection.module.css'

const mid = Math.ceil(ALL_ARTISTS.length / 2)
const leftNames = ALL_ARTISTS.slice(0, mid)
const rightNames = ALL_ARTISTS.slice(mid)

export function ArtistsSection() {
  return (
    <section id="artists" className={styles.section}>
      <h2 className={styles.title}>Artists</h2>

      <div className={styles.waterfallViewport}>
        <div className={styles.columns}>
          <div className={styles.columnLeft}>
            {leftNames.map((name) => (
              <span key={name} className={styles.name}>{name}</span>
            ))}
          </div>
          <div className={styles.columnRight}>
            {rightNames.map((name) => (
              <span key={name} className={styles.name}>{name}</span>
            ))}
          </div>
        </div>
      </div>

      <p className={styles.footer}>
        {ALL_ARTISTS.length} artists across 5 editions
      </p>
    </section>
  )
}
