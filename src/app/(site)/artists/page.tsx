import { css } from 'styled-system/css'
import { Container } from 'styled-system/jsx'
import { section } from 'styled-system/recipes'
import { ArtistsTable } from '@/components/ArtistsTable/ArtistsTable'
import { PageHero } from '@/components/PageHero/PageHero'
import { getAllEditionYears } from '@/data/editions'
import { pageMetadata } from '@/lib/seo'
import { getArtistIndex } from '@/sanity/lib/artists'

export const metadata = pageMetadata({
  title: 'Artists',
  description:
    'Sculptors and visual artists who have shown work at Bucharest Sculpture Days across all editions.',
  path: '/artists',
})

export default async function ArtistsPage() {
  const [artists, editionYears] = await Promise.all([getArtistIndex(), getAllEditionYears()])
  const editionCount = editionYears.length

  return (
    <main>
      <PageHero
        flush
        title={
          <>
            Artist<span className={css({ color: 'action' })}>s</span>
          </>
        }
        lead="Sculptors and visual artists who have shown work at Bucharest Sculpture Days across all editions."
      />

      <section className={section({ ground: 'dark' })}>
        <Container>
          <ArtistsTable
            artists={artists}
            className={css({ maxWidth: '[820px]', marginInline: 'auto' })}
            meta={[
              { label: 'Total', value: artists.length },
              { label: 'Editions', value: editionCount },
            ]}
          />
        </Container>
      </section>
    </main>
  )
}
