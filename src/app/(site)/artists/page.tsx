import { NameCloud } from '@artists-components/NameCloud'
import { Container } from 'styled-system/jsx'
import { section } from 'styled-system/recipes'
import { EditionsNav } from '@/components/EditionsNav/EditionsNav'
import { PageHero } from '@/components/PageHero/PageHero'
import { pageMetadata } from '@/lib/seo'
import { getArtistCloud } from '@/sanity/lib/artists'

export const metadata = pageMetadata({
  title: 'Artists',
  description:
    'Sculptors and visual artists who have shown work at Bucharest Sculpture Days across all editions.',
  path: '/artists',
})

export default async function ArtistsPage() {
  const artists = await getArtistCloud()

  return (
    <>
      <main>
        <PageHero
          flush
          title="Artists"
          lead="Sculptors and visual artists who have shown work at Bucharest Sculpture Days across all editions."
        />

        {artists.length > 0 && (
          <section className={section({ ground: 'dark' })}>
            <Container>
              <NameCloud artists={artists} />
            </Container>
          </section>
        )}
      </main>
      <EditionsNav />
    </>
  )
}
