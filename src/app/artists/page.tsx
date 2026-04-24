import type { Metadata } from 'next'
import { ArtistsTable } from '@/components/ArtistsTable/ArtistsTable'
import shared from '@/components/Shared.module.css'
import { ALL_ARTISTS } from '@/data/artists'
import { getAllEditionYears } from '@/data/editions'
import styles from './page.module.css'

export const metadata: Metadata = {
  title: 'Artists',
  description:
    'Sculptors and visual artists who have shown work at Bucharest Sculpture Days across all editions.',
  alternates: { canonical: '/artists' },
}

export default function ArtistsPage() {
  const editionCount = getAllEditionYears().length

  return (
    <main>
      <section className={`${shared.section} ${shared.sectionDark} ${styles.main}`}>
        <div className={shared.sectionInner}>
          <header className={styles.header}>
            <h1 className={shared.pageTitle}>
              Artist<span className={shared.accent}>s</span>
            </h1>
            <p className={styles.lead}>
              Sculptors and visual artists who have shown work at Bucharest Sculpture Days across
              all editions.
            </p>
          </header>

          <ArtistsTable
            artists={ALL_ARTISTS}
            className={styles.table}
            meta={[
              { label: 'Total', value: ALL_ARTISTS.length },
              { label: 'Editions', value: editionCount },
            ]}
          />
        </div>
      </section>
    </main>
  )
}
