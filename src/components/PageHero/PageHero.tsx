import type { ReactNode } from 'react'
import { Container, Stack, Text } from 'styled-system/jsx'
import { pageHero } from './PageHero.recipe'

interface PageHeroProps {
  /** The page title. Usually an <AccentSplit>, but any node is accepted. */
  title: ReactNode
  /** Optional standfirst below the title. */
  lead?: ReactNode
  /** Drop the hero's bottom padding when a section follows directly (the
   *  section's `sectionY` top becomes the single gap). */
  flush?: boolean
}

export function PageHero({ title, lead, flush }: PageHeroProps) {
  const styles = pageHero({ flush })
  return (
    <section className={styles.hero}>
      <Container>
        <Stack gap="xl">
          <Text as="h1" variant="display" className={styles.title}>
            {title}
          </Text>
          {lead != null && (
            <Text as="p" variant="lead" className={styles.lead}>
              {lead}
            </Text>
          )}
        </Stack>
      </Container>
    </section>
  )
}
