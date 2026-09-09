import { themeArtists } from '@edition-components/ThemeArtists.recipe'
import { cx } from 'styled-system/css'
import { section } from 'styled-system/recipes'
import { ArtistRoster } from '@/components/ArtistRoster/ArtistRoster'
import { GalleryCarousel } from '@/components/Carousel/GalleryCarousel'
import { EditionTheme } from '@/components/EditionTheme/EditionTheme'
import type { Edition } from '@/types/edition'

const styles = themeArtists()

interface ThemeArtistsProps {
  edition: Pick<Edition, 'year' | 'theme' | 'themeHighlight' | 'artists' | 'carousel'>
}

export function ThemeArtists({ edition }: ThemeArtistsProps) {
  const { year, theme, themeHighlight, artists, carousel } = edition

  return (
    <section className={cx(section({ ground: 'dark' }), styles.section)}>
      <div className={styles.inner}>
        <EditionTheme as="h2" size="large" theme={theme} themeHighlight={themeHighlight} />
      </div>

      {carousel.length > 0 && (
        <GalleryCarousel
          id="edition-gallery"
          label="Edition photo gallery"
          slides={carousel}
          treatment="color"
          size="large"
        />
      )}

      {artists.length > 0 && (
        <ArtistRoster
          artists={artists}
          designation={`Edition ${year - 2020}-${year}`}
          className={styles.inner}
        />
      )}
    </section>
  )
}
