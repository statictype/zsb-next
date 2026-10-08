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

/** Renders the list that feeds the `FAQPage` JSON-LD in `page.tsx`; Google requires that Q&A to be visible on the page. */
export function VisitFaq({ entries }: VisitFaqProps) {
  if (entries.length === 0) return null
  const s = visitFaq()
  return (
    <section className={cx(section(), s.section)} aria-labelledby="visit-faq-title">
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
