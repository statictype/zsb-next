import { visitFaq } from '@site/visit/_components/VisitFaq.recipe'
import { cx } from 'styled-system/css'
import { Container, Stack, Text } from 'styled-system/jsx'
import { section } from 'styled-system/recipes'
import { Accordion } from '@/components/ui/Accordion/Accordion'
import { SectionHeading } from '@/components/ui/SectionHeading/SectionHeading'
import type { FaqEntry } from '@/lib/seo'

interface VisitFaqProps {
  entries: FaqEntry[]
}

/**
 * Renders the same list that feeds the `FAQPage` JSON-LD in `page.tsx`. Google
 * requires the structured Q&A to be present on the page, so the two never come
 * from separate sources.
 */
export function VisitFaq({ entries }: VisitFaqProps) {
  if (entries.length === 0) return null
  const s = visitFaq()
  return (
    <section
      className={cx(section({ ground: 'dark' }), s.section)}
      aria-labelledby="visit-faq-title"
    >
      <Container>
        <Stack gap="xl">
          <SectionHeading id="visit-faq-title" size="detail">
            Good to know
          </SectionHeading>
          <Accordion
            id="visit-faq"
            className={s.list}
            items={entries.map((entry) => ({
              id: entry.question,
              trigger: entry.question,
              triggerHeading: 'h3',
              content: (
                <Text as="p" variant="body" className={s.answer}>
                  {entry.answer}
                </Text>
              ),
            }))}
          />
        </Stack>
      </Container>
    </section>
  )
}
