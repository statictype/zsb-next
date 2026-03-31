import type { Metadata } from 'next'
import { EditionCard } from '@/components/EditionCard/EditionCard'
import { JsonLd } from '@/components/JsonLd/JsonLd'
import shared from '@/components/Shared.module.css'
import { editionCards } from '@/data/editions/cards'
import { SITE_URL } from '@/lib/constants'
import styles from './page.module.css'

export const metadata: Metadata = {
  title: 'Editions',
  description: 'Browse all editions of Bucharest Sculpture Days, from 2021 to 2025.',
  alternates: { canonical: '/editions' },
}

export default function EditionsPage() {
  return (
    <main>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: 'Home',
              item: SITE_URL,
            },
            {
              '@type': 'ListItem',
              position: 2,
              name: 'Editions',
              item: `${SITE_URL}/editions`,
            },
          ],
        }}
      />
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <header className={styles.heroHeader}>
            <h1 className={shared.pageTitle}>
              Edit<span className={shared.accent}>ions</span>
            </h1>
          </header>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.grid}>
          {editionCards.map((edition) => (
            <EditionCard key={edition.year} edition={edition} />
          ))}
        </div>
      </section>
    </main>
  )
}
