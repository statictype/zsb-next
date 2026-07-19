import { visitFaq } from '@site/visit/_components/VisitFaq.recipe'
import { Container, Stack, Text } from 'styled-system/jsx'
import { section } from 'styled-system/recipes'
import { Accordion } from '@/components/ui/Accordion/Accordion'
import { SectionHeading } from '@/components/ui/SectionHeading/SectionHeading'
import type { FaqEntry } from '@/lib/seo'

interface VisitFaqProps {
  entries: FaqEntry[]
}

/**
 * Visible Visit-page FAQ. Renders the SAME merged list (derived hours/location
 * + editorial entries) that feeds the `FAQPage` JSON-LD — Google requires the
 * structured Q&A to be present on the page, so there is one source, two
 * renderings. The shared Accordion starts collapsed and keeps every answer in
 * the DOM so the visible content and structured data remain aligned.
 */
export function VisitFaq({ entries }: VisitFaqProps) {
  if (entries.length === 0) return null
  const s = visitFaq()
  return (
    <section className={section({ ground: 'dark' })} aria-labelledby="visit-faq-title">
      <Container>
        <Stack gap="xl">
          <SectionHeading id="visit-faq-title">Good to know</SectionHeading>
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
