import { cx } from 'styled-system/css'
import { editorialSplit } from 'styled-system/patterns'
import { section } from 'styled-system/recipes'
import { ArtistsTable } from '@/components/ArtistsTable/ArtistsTable'
import { Carousel } from '@/components/Carousel/Carousel'
import { SectionHeading } from '@/components/ui/SectionHeading/SectionHeading'
import type { Edition } from '@/types/edition'
import { themeArtists } from './ThemeArtists.recipe'

const styles = themeArtists()

interface ThemeArtistsProps {
  edition: Pick<Edition, 'year' | 'theme' | 'themeSection' | 'artists'> & {
    carousel?: Edition['carousel']
  }
}

export function ThemeArtists({ edition }: ThemeArtistsProps) {
  const { year, theme, themeSection, artists, carousel } = edition

  return (
    <section className={cx(section({ ground: 'dark' }), styles.section)}>
      <div className={styles.themeHeader}>
        <SectionHeading case="sentence" flush>
          {theme}
        </SectionHeading>
      </div>
      <div className={cx(editorialSplit(), styles.inner)}>
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
