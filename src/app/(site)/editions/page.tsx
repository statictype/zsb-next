import { editionsPage } from '@site/editions/page.recipe'
import { css } from 'styled-system/css'
import { Container } from 'styled-system/jsx'
import { section } from 'styled-system/recipes'
import { DraftAware } from '@/components/DraftAware/DraftAware'
import { EditionCard } from '@/components/EditionCard/EditionCard'
import { PageHero } from '@/components/PageHero/PageHero'
import { getEditionCards } from '@/data/editions'
import { pageMetadata } from '@/lib/seo'
import { type DynamicFetchOptions } from '@/sanity/lib/live'

const styles = editionsPage()

export const metadata = pageMetadata({
  title: 'Editions',
  description: 'Every edition of Bucharest Sculpture Days, from 2021 to today.',
  path: '/editions',
})

export default function EditionsPage() {
  return (
    <DraftAware
      cached={(options) => <CachedEditionsList options={options} />}
      fallback={<EditionsListShell />}
    />
  )
}

async function CachedEditionsList({ options }: { options: DynamicFetchOptions }) {
  'use cache'
  // Already status-filtered and year-desc in the query, so the list reads
  // newest first and the plates alternate down that order.
  const editions = await getEditionCards(options)

  return (
    <EditionsListShell>
      <ol className={styles.index}>
        {editions.map((edition, index) => (
          <li key={edition.year} className={styles.entry}>
            <EditionCard
              edition={edition}
              href={edition.href}
              media={index % 2 === 0 ? 'left' : 'right'}
            />
          </li>
        ))}
      </ol>
    </EditionsListShell>
  )
}

function EditionsListShell({ children }: { children?: React.ReactNode }) {
  return (
    <main>
      <PageHero
        flush
        title={
          <>
            Edition<span className={css({ color: 'action' })}>s</span>
          </>
        }
        lead="Five past editions. Five #, each one a curatorial position, not just a title. Together they trace a movement: from the space sculpture inhabits, to the emotional conditions it holds, to the forces it models, to the body it refuses to idealise. Not a plan. A conversation that keeps going."
      />

      <section className={section({ ground: 'dark' })}>
        <Container>{children}</Container>
      </section>
    </main>
  )
}
