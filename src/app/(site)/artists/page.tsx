import { css } from 'styled-system/css'
import { ArtistsTable } from '@/components/ArtistsTable/ArtistsTable'
import { getAllEditionYears } from '@/data/editions'
import { pageMetadata } from '@/lib/seo'
import { getArtistNames } from '@/sanity/lib/artists'

export const metadata = pageMetadata({
  title: 'Artists',
  description:
    'Sculptors and visual artists who have shown work at Bucharest Sculpture Days across all editions.',
  path: '/artists',
})

// pageTitle is typography-only; the entrance animation lives at the call site.
const pageTitle = css({
  textStyle: 'pageTitle',
  opacity: 0,
  animation: 'fadeSlideUp 1s {easings.expo} 0.2s forwards',
})
const lead = css({ textStyle: 'lead', maxWidth: '60ch', marginTop: 'xl' })

export default async function ArtistsPage() {
  const [artists, editionYears] = await Promise.all([getArtistNames(), getAllEditionYears()])
  const editionCount = editionYears.length

  return (
    <main>
      <section className={css({ layerStyle: 'pageHero' })}>
        <div className={css({ layerStyle: 'sectionInner' })}>
          <h1 className={pageTitle}>
            Artist<span className={css({ color: 'action' })}>s</span>
          </h1>
          <p className={lead}>
            Sculptors and visual artists who have shown work at Bucharest Sculpture Days across all
            editions.
          </p>
        </div>
      </section>

      <section
        className={css({
          layerStyle: 'sectionDark',
          paddingTop: '0',
          paddingInline: 'content',
          paddingBottom: 'sectionY',
        })}
      >
        <div className={css({ layerStyle: 'sectionInner' })}>
          <ArtistsTable
            artists={artists}
            className={css({ maxWidth: '820px', marginInline: 'auto' })}
            meta={[
              { label: 'Total', value: artists.length },
              { label: 'Editions', value: editionCount },
            ]}
          />
        </div>
      </section>
    </main>
  )
}
