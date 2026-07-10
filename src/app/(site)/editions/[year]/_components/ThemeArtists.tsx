import { cx } from 'styled-system/css'
import { Grid, Stack, Text } from 'styled-system/jsx'
import { section } from 'styled-system/recipes'
import { ArtistsTable } from '@/components/ArtistsTable/ArtistsTable'
import { GalleryCarousel } from '@/components/Carousel/GalleryCarousel'
import { SectionHeading } from '@/components/ui/SectionHeading/SectionHeading'
import type { Edition } from '@/types/edition'
import { themeArtists } from './ThemeArtists.recipe'

const styles = themeArtists()

interface ThemeArtistsProps {
  edition: Pick<Edition, 'year' | 'theme' | 'themeSection' | 'artists' | 'carousel'>
}

export function ThemeArtists({ edition }: ThemeArtistsProps) {
  const { year, theme, themeSection, artists, carousel } = edition

  return (
    <section className={cx(section({ ground: 'dark' }), styles.section)}>
      <Stack gap="3xl">
        <div className={styles.themeHeader}>
          <SectionHeading flush>{theme}</SectionHeading>
        </div>
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
            meta={[
              { label: 'Total', value: artists.length },
              { label: 'Edition', value: `${year - 2020}-${year}` },
            ]}
          />
        </Grid>
      </Stack>

      {carousel && <GalleryCarousel slides={carousel} eyebrow={theme} />}
    </section>
  )
}
