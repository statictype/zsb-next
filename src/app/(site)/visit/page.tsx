import { VenuesView } from '@site/visit/_components/VenuesView'
import { VisitFaq } from '@site/visit/_components/VisitFaq'
import { VisitSection } from '@site/visit/_components/VisitSection'
import { notFound } from 'next/navigation'
import { AccentSplit } from '@/components/AccentSplit/AccentSplit'
import { DraftAware } from '@/components/DraftAware/DraftAware'
import { JsonLd } from '@/components/JsonLd/JsonLd'
import { PageHero } from '@/components/PageHero/PageHero'
import { getVisitEdition } from '@/data/editions'
import { makePageMetadata, visitFaqJsonLd } from '@/lib/seo'
import { type DynamicFetchOptions } from '@/sanity/lib/live'
import { getVisitPage } from '@/sanity/lib/staticPages'

export const generateMetadata = makePageMetadata(getVisitPage, {
  title: 'Visit',
  path: '/visit',
})

export default function VisitRoute() {
  return <DraftAware cached={(options) => <CachedVisit options={options} />} fallback={null} />
}

async function CachedVisit({ options }: { options: DynamicFetchOptions }) {
  'use cache'
  const [page, visitEdition] = await Promise.all([getVisitPage(options), getVisitEdition(options)])
  if (!page) notFound()
  const { faq } = page
  return (
    <main>
      <PageHero
        flush
        title={<AccentSplit text="Plan your visit" accent="visit" />}
        lead="The main venue, the opening hours, and how to get there. During the event the program also runs at partner venues and public locations across Bucharest."
      />
      <VisitSection {...page.section} />
      {visitEdition ? (
        <VenuesView year={visitEdition.year} sections={visitEdition.sections} />
      ) : null}
      <VisitFaq entries={faq} />
      {faq.length > 0 && <JsonLd data={visitFaqJsonLd(faq)} />}
    </main>
  )
}
