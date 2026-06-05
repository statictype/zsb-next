import shared from '@/components/Shared.module.css'
import type { FaqEntry } from '@/lib/seo'
import styles from './VisitFaq.module.css'

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
  return (
    <section className={`${shared.section} ${styles.faq}`} aria-labelledby="visit-faq-title">
      <div className={shared.sectionInner}>
        <h2 id="visit-faq-title" className={shared.sectionTitle}>
          Good to know
        </h2>
        <div className={styles.list}>
          {entries.map((entry) => (
            <article key={entry.question} className={styles.item}>
              <h3 className={styles.question}>{entry.question}</h3>
              <p className={styles.answer}>{entry.answer}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
