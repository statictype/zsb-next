import { type CSSProperties } from 'react'
import { css } from 'styled-system/css'
import { section } from 'styled-system/recipes'
import { DraftAware } from '@/components/DraftAware/DraftAware'
import { EditionCard } from '@/components/EditionCard/EditionCard'
import { PageHero } from '@/components/PageHero/PageHero'
import { getAllEditionYears, getEdition } from '@/data/editions'
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
  const years = await getAllEditionYears()
  const editions = await Promise.all(years.map(async (year) => getEdition(year, options)))
  // Filter nulls (e.g. upcoming editions hidden from the list) BEFORE mapping, so
  // index 0 is the first *visible* edition — the latest live one gets the feature
  // treatment regardless of how many hidden years precede it.
  const visibleEditions = editions.filter((edition) => edition != null)

  return (
    <EditionsListShell>
      <div className={styles.grid}>
        {visibleEditions.map((edition, index) => {
          const year = edition.year
          const isFeature = index === 0
          const thumb = edition.thumbImage ?? edition.heroImage

          return (
            <div
              key={year}
              className={styles.slot}
              data-feature={isFeature || undefined}
              style={{ '--card-index': index } as CSSProperties}
            >
              <EditionCard
                year={year}
                theme={edition.theme}
                themeHighlight={edition.themeHighlight}
                image={thumb}
                edition={edition}
                href={`/editions/${year}`}
                media="image"
                size={isFeature ? 'lg' : 'md'}
                themeDelay={THEME_STAGGER}
                className={styles.card}
              />
            </div>
          )
        })}
      </div>
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
        <div className={styles.inner}>{children}</div>
      </section>
    </main>
  )
}
