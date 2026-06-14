import type { FaqEntry } from '@/lib/seo'
import { visitFaq } from './VisitFaq.recipe'

interface VisitFaqProps {
  entries: FaqEntry[]
}

/**
 * Visible Visit-page FAQ. Renders the SAME merged list (derived hours/location
 * + editorial entries) that feeds the `FAQPage` JSON-LD — Google requires the
 * structured Q&A to be present on the page, so there is one source, two
 * renderings. Questions are real headings so AI answer engines and search can
 * parse them. Renders nothing when there are no entries.
 */
export function VisitFaq({ entries }: VisitFaqProps) {
  if (entries.length === 0) return null
  const s = visitFaq()
  return (
    <section className={s.section} aria-labelledby="visit-faq-title">
      <div className={s.inner}>
        <h2 id="visit-faq-title" className={s.title}>
          Good to know
        </h2>
        <div className={s.list}>
          {entries.map((entry) => (
            <article key={entry.question} className={s.item}>
              <h3 className={s.question}>{entry.question}</h3>
              <p className={s.answer}>{entry.answer}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
