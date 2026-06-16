import { section } from 'styled-system/recipes'
import { Disclosure } from '@/components/ui/Disclosure/Disclosure'
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
 * renderings. Each entry is a shared `<Disclosure>` (collapsed by default): the
 * question stays a real `<h3>` inside the summary so AI/search can parse it, and
 * native `<details>` keeps every answer in the DOM (crawlable) even when
 * visually collapsed. Renders nothing when there are no entries.
 */
export function VisitFaq({ entries }: VisitFaqProps) {
  if (entries.length === 0) return null
  const s = visitFaq()
  return (
    <section className={section({ ground: 'dark' })} aria-labelledby="visit-faq-title">
      <div className={s.inner}>
        <SectionHeading id="visit-faq-title">Good to know</SectionHeading>
        <div className={s.list}>
          {entries.map((entry) => (
            <Disclosure
              key={entry.question}
              className={s.item}
              summary={<h3 className={s.question}>{entry.question}</h3>}
            >
              <p className={s.answer}>{entry.answer}</p>
            </Disclosure>
          ))}
        </div>
      </div>
    </section>
  )
}
