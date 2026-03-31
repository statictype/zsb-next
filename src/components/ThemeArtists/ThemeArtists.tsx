import { ReadMore } from '@/components/ReadMore/ReadMore'
import { padNum, splitInHalf } from '@/lib/format-utils'
import type { Edition } from '@/types/edition'
import styles from './ThemeArtists.module.css'

interface ThemeArtistsProps {
  edition: Pick<Edition, 'year' | 'theme' | 'themeSection' | 'artists'>
}

function renderStatementWithTheme(text: string, theme: string) {
  const idx = text.indexOf(theme)
  if (idx === -1) {
    return <p>{text}</p>
  }
  return (
    <p>
      {text.slice(0, idx)}
      <em>{theme}</em>
      {text.slice(idx + theme.length)}
    </p>
  )
}

export function ThemeArtists({ edition }: ThemeArtistsProps) {
  const { year, theme, themeSection, artists } = edition
  const [firstHalf, secondHalf] = splitInHalf(artists)
  const mid = firstHalf.length

  return (
    <section className={styles.section}>
      <div className={styles.themeHeader}>
        <h2 className={styles.headline}>{theme}</h2>
      </div>

      <div className={styles.inner}>
        <div className={styles.lead}>
          <p>{themeSection.lead}</p>
        </div>

        <ReadMore dark={true}>
          <div className={styles.bodyWrapper}>
            <div className={styles.body}>
              <p>{themeSection.body.join(' ')}</p>
            </div>
            {themeSection.coda && (
              <div className={styles.coda}>
                <p>{themeSection.coda.join(' ')}</p>
              </div>
            )}
          </div>
        </ReadMore>

        <div className={styles.artistsBlock}>
          <div className={styles.artistsStatement}>
            {renderStatementWithTheme(themeSection.artistsStatement, theme)}
          </div>

          <div className={styles.colHeader}>
            <span className={styles.headerLabel}>Artists</span>
            <span>001&mdash;{padNum(artists.length, 3)}</span>
          </div>

          <div className={styles.artistsTable}>
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
