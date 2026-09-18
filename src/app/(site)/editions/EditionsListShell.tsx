import { editionsPage } from '@site/editions/page.recipe'
import { Container } from 'styled-system/jsx'
import { section } from 'styled-system/recipes'
import { EditionCard } from '@/components/EditionCard/EditionCard'
import { PageHero } from '@/components/PageHero/PageHero'
import type { EditionSummary } from '@/types/edition'

const styles = editionsPage()

export function EditionsListShell({ editions = [] }: { editions?: EditionSummary[] }) {
  return (
    <main>
      <PageHero
        flush
        title="Editions"
        lead="Each # is a curatorial position, not a title. Together they trace a movement: from the space sculpture inhabits, to the emotional conditions it holds, to the forces it models, to the body it refuses to idealise."
      />

      <section className={section({ ground: 'dark' })}>
        <Container>
          {editions.length > 0 && (
            <ol className={styles.index}>
              {editions.map((edition, index) => (
                <li key={edition.year} className={styles.entry}>
                  <EditionCard
                    edition={edition}
                    href={edition.href}
                    media={index % 2 === 0 ? 'left' : 'right'}
                    preload={index === 0}
                  />
                </li>
              ))}
            </ol>
          )}
        </Container>
      </section>
    </main>
  )
}
