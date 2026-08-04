import { themeArtists } from '@edition-components/ThemeArtists.recipe'
import { cx } from 'styled-system/css'
import { Grid, Text } from 'styled-system/jsx'
import { section } from 'styled-system/recipes'
import { ArtistsTable } from '@/components/ArtistsTable/ArtistsTable'
import { GalleryCarousel } from '@/components/Carousel/GalleryCarousel'
import type { Edition } from '@/types/edition'

const styles = themeArtists()

interface ThemeArtistsProps {
  edition: Pick<Edition, 'year' | 'theme' | 'themeSection' | 'artists' | 'carousel'>
}

export function ThemeArtists({ edition }: ThemeArtistsProps) {
  const { year, theme, themeSection, artists, carousel } = edition

  return (
    <section className={cx(section({ ground: 'dark' }), styles.section)}>
      <Grid
        className={styles.inner}
        gridTemplateColumns={{ lg: '0.8fr 1.2fr' }}
        rowGap={{ base: '2xl', lg: 'lg' }}
        columnGap={{ lg: '4xl' }}
      >
        <div className={styles.body}>
          <Text as="p" variant="body">
            {themeSection.body}
          </Text>
        </div>

        <ArtistsTable
          artists={artists}
          className={styles.artistsTable}
          meta={[{ label: 'Edition', value: `${year - 2020}-${year}` }]}
        />
      </Grid>

      {carousel.length > 0 && (
        <GalleryCarousel
          id="edition-gallery"
          label="Edition photo gallery"
          slides={carousel}
          eyebrow={theme}
          treatment="color"
          className={styles.carousel}
        />
      )}
    </section>
  )
}
