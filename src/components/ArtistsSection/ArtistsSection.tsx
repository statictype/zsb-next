import shared from '@/components/Shared.module.css'
import { ALL_ARTISTS } from '@/data/artists'
import styles from './ArtistsSection.module.css'

export function ArtistsSection() {
  return (
    <section id="artists" className={styles.section}>
      <h2 className={`${shared.sectionTitle} ${shared.sectionTitleDark} ${styles.title}`}>
        Artists
      </h2>

      <ol className={styles.rows}>
        {ALL_ARTISTS.map((name, i) => (
          <li key={name} data-side={i % 2 === 0 ? 'left' : 'right'} className={styles.row}>
            {name}
          </li>
        ))}
      </ol>

      <p className={styles.footer}>{ALL_ARTISTS.length} artists across 5 editions</p>
    </section>
  )
}
