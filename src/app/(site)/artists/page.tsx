import { ArtistsTable } from '@/components/ArtistsTable/ArtistsTable'
import shared from '@/components/Shared.module.css'
import { getAllEditionYears } from '@/data/editions'
import { pageMetadata } from '@/lib/seo'
import { getArtistNames } from '@/sanity/lib/artists'
import styles from './page.module.css'

export const metadata = pageMetadata({
  title: 'Artists',
  description:
    'Sculptors and visual artists who have shown work at Bucharest Sculpture Days across all editions.',
  path: '/artists',
})

export default async function ArtistsPage() {
  const [artists, editionYears] = await Promise.all([getArtistNames(), getAllEditionYears()])
  const editionCount = editionYears.length

  return (
    <main>
      <section className={shared.pageHero}>
        <div className={shared.sectionInner}>
          <h1 className={shared.pageTitle}>
            Artist<span className={shared.accent}>s</span>
          </h1>
          <p className={shared.lead}>
            Sculptors and visual artists who have shown work at Bucharest Sculpture Days across all
            editions.
          </p>
        </div>
      </section>

      <section className={`${shared.sectionDark} ${styles.list}`}>
        <div className={shared.sectionInner}>
          <ArtistsTable
            artists={artists}
            className={styles.table}
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
