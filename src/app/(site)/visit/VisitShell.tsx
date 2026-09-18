import { VisitFaq } from '@site/visit/_components/VisitFaq'
import { VisitSection } from '@site/visit/_components/VisitSection'
import { JsonLd } from '@/components/JsonLd/JsonLd'
import { PageHero } from '@/components/PageHero/PageHero'
import { visitFaqJsonLd } from '@/lib/seo'
import type { VisitPageData } from '@/sanity/lib/staticPages'

export function VisitShell({ section, faq }: VisitPageData) {
  return (
    <main>
      <PageHero flush title="Plan your visit" />
      <VisitSection {...section} />
      <VisitFaq entries={faq} />
      {faq.length > 0 && <JsonLd data={visitFaqJsonLd(faq)} />}
    </main>
  )
}
