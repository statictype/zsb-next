import type { Metadata } from 'next'
import { ArtistsSection } from '@/components/ArtistsSection/ArtistsSection'
import shared from '@/components/Shared.module.css'
import styles from './page.module.css'

export const metadata: Metadata = {
  title: 'Artists',
  description:
    'Sculptors and visual artists who have shown work at Bucharest Sculpture Days across all editions.',
  alternates: { canonical: '/artists' },
}

export default function ArtistsPage() {
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

          <ArtistsSection />
        </div>
      </section>
    </main>
  )
}
