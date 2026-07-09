import { Container } from 'styled-system/jsx'
import { section } from 'styled-system/recipes'
import { Accordion } from '@/components/ui/Accordion/Accordion'
import { SectionHeading } from '@/components/ui/SectionHeading/SectionHeading'
import type { FaqEntry } from '@/lib/seo'
import { visitFaq } from './VisitFaq.recipe'

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
        <SectionHeading id="visit-faq-title">Good to know</SectionHeading>
        <Accordion
          id="visit-faq"
          className={s.list}
          items={entries.map((entry) => ({
            id: entry.question,
            trigger: entry.question,
            triggerHeading: 'h3',
            content: <p className={s.answer}>{entry.answer}</p>,
          }))}
        />
      </Container>
    </section>
  )
}
