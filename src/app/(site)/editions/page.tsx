import { type CSSProperties } from 'react'
import { css } from 'styled-system/css'
import { Container, Grid } from 'styled-system/jsx'
import { section } from 'styled-system/recipes'
import { DraftAware } from '@/components/DraftAware/DraftAware'
import { EditionCard } from '@/components/EditionCard/EditionCard'
import { PageHero } from '@/components/PageHero/PageHero'
import { getEditionCards } from '@/data/editions'
import { pageMetadata } from '@/lib/seo'
import { type DynamicFetchOptions } from '@/sanity/lib/live'
import { editionsPage } from './page.recipe'

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

// The per-card stagger for the theme tape's entrance (reads `--card-index` off
// the slot). The tape's `tapeIn` is the card's reveal motion.
const THEME_STAGGER = 'calc(var(--card-index, 0) * 120ms + 120ms)'

async function CachedEditionsList({ options }: { options: DynamicFetchOptions }) {
  'use cache'
  // Already status-filtered and year-desc in the query, so index 0 is the
  // newest live edition — the one that gets the feature treatment.
  const editions = await getEditionCards(options)

  return (
    <EditionsListShell>
      <Grid columns={{ base: 1, lg: 2 }}>
        {editions.map((edition, index) => {
          const isFeature = index === 0

          return (
            <div
              key={edition.year}
              className={styles.slot}
              data-feature={isFeature || undefined}
              style={{ '--card-index': index } as CSSProperties}
            >
              <EditionCard
                edition={edition}
                href={`/editions/${edition.year}`}
                size={isFeature ? 'lg' : 'md'}
                themeDelay={THEME_STAGGER}
                className={styles.card}
              />
            </div>
          )
        })}
      </Grid>
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
