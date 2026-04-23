import shared from '@/components/Shared.module.css'
import { padNum, splitInHalf } from '@/lib/format-utils'
import type { Edition } from '@/types/edition'
import styles from './ThemeArtists.module.css'

interface ThemeArtistsProps {
  edition: Pick<Edition, 'year' | 'theme' | 'themeSection' | 'artists'>
}

export function ThemeArtists({ edition }: ThemeArtistsProps) {
  const { year, theme, themeSection, artists } = edition
  const [firstHalf, secondHalf] = splitInHalf(artists)
  const mid = firstHalf.length

  return (
    <section className={`${shared.section} ${shared.sectionDark} ${styles.section}`}>
      <div className={styles.themeHeader}>
        <h2 className={styles.headline}>{theme}</h2>
      </div>
      <div className={styles.inner}>
        <div className={styles.body}>
          <p>{themeSection.body.join(' ')}</p>
        </div>

        <div className={styles.artistsTable}>
          <div className={styles.colHeader}>
            <span className={styles.headerLabel}>Artists</span>
            <span>001&mdash;{padNum(artists.length, 3)}</span>
          </div>

          <div className={styles.artistsTableBody}>
            <div className={styles.artistsColumn}>
              {firstHalf.map((name, i) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: static list
                <div key={i} className={styles.artistEntry}>
                  <span className={styles.artistNum}>{padNum(i + 1, 3)}</span>
                  <span className={styles.artistName}>{name}</span>
                </div>
              ))}
            </div>
            <div className={styles.artistsColumn}>
              {secondHalf.map((name, i) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: static list
                <div key={i} className={styles.artistEntry}>
                  <span className={styles.artistNum}>{padNum(mid + i + 1, 3)}</span>
                  <span className={styles.artistName}>{name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.tableFooter}>
            <div className={styles.tableMeta}>
              <div className={styles.tableMetaItem}>
                Total<span>{artists.length}</span>
              </div>
              <div className={styles.tableMetaItem}>
                Edition
                <span>
                  {year - 2020}-{year}
                </span>
              </div>
            </div>
            <div className={styles.tableBarcode} />
          </div>
        </div>
      </div>

    </section>
  )
}
