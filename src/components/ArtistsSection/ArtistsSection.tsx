import { ALL_ARTISTS } from '@/data/artists'
import styles from './ArtistsSection.module.css'

export function ArtistsSection() {
  return (
    <div id="artists" className={styles.wrap}>
      <ol className={styles.rows}>
        {ALL_ARTISTS.map((name, i) => (
          <li key={name} data-side={i % 2 === 0 ? 'left' : 'right'} className={styles.row}>
            {name}
          </li>
        ))}
      </ol>

      <p className={styles.footer}>{ALL_ARTISTS.length} artists across 5 editions</p>
    </div>
  )
}
