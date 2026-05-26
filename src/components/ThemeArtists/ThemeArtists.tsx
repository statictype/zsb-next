import { ArtistsTable } from '@/components/ArtistsTable/ArtistsTable'
import { Carousel } from '@/components/Carousel/Carousel'
import shared from '@/components/Shared.module.css'
import type { Edition } from '@/types/edition'
import styles from './ThemeArtists.module.css'

interface ThemeArtistsProps {
  edition: Pick<Edition, 'year' | 'theme' | 'themeSection' | 'artists'> & {
    carousel?: Edition['carousel']
  }
}

export function ThemeArtists({ edition }: ThemeArtistsProps) {
  const { year, theme, themeSection, artists, carousel } = edition

  return (
    <section className={`${shared.section} ${shared.sectionDark} ${styles.section}`}>
      <div className={styles.themeHeader}>
        <h2 className={styles.headline}>{theme}</h2>
      </div>
      <div className={styles.inner}>
        <div className={styles.body}>
          <p>{themeSection.body}</p>
        </div>

        <ArtistsTable
          artists={artists}
          className={styles.artistsTable}
          meta={[
            { label: 'Total', value: artists.length },
            { label: 'Edition', value: `${year - 2020}-${year}` },
          ]}
        />
      </div>

      {carousel && <Carousel slides={carousel} eyebrow={theme} />}
    </section>
  )
}
