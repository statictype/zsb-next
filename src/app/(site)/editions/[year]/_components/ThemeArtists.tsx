import { themeArtists } from '@edition-components/ThemeArtists.recipe'
import { cx } from 'styled-system/css'
import { section } from 'styled-system/recipes'
import { ArtistRoster } from '@/components/ArtistRoster/ArtistRoster'
import { GalleryCarousel } from '@/components/Carousel/GalleryCarousel'
import type { Edition } from '@/types/edition'

const styles = themeArtists()

interface ThemeArtistsProps {
  edition: Pick<Edition, 'year' | 'theme' | 'artists' | 'carousel'>
}

export function ThemeArtists({ edition }: ThemeArtistsProps) {
  const { year, theme, artists, carousel } = edition

  return (
    <section className={cx(section({ ground: 'dark' }), styles.section)}>
      {carousel.length > 0 && (
        <GalleryCarousel
          id="edition-gallery"
          label="Edition photo gallery"
          slides={carousel}
          eyebrow={theme}
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
