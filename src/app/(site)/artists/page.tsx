import { NameCloud } from '@artists-components/NameCloud'
import { OnlineArtistList } from '@artists-components/OnlineArtistList'
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
  const { cloud, onlineOnly } = await getArtistCloud()

  return (
    <>
      <main>
        <PageHero
          flush
          title="Artists"
          lead="Sculptors and visual artists who have shown work at Bucharest Sculpture Days across all editions."
        />

        {(cloud.length > 0 || onlineOnly.length > 0) && (
          <section className={section({ ground: 'dark' })}>
            <Container>
              {cloud.length > 0 && <NameCloud artists={cloud} />}
              {onlineOnly.length > 0 && <OnlineArtistList artists={onlineOnly} />}
            </Container>
          </section>
        )}
      </main>
      <EditionsNav />
    </>
  )
}
