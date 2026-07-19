import { VenuesView } from '@site/visit/_components/VenuesView'
import { VisitFaq } from '@site/visit/_components/VisitFaq'
import { VisitSection } from '@site/visit/_components/VisitSection'
import { DraftAware } from '@/components/DraftAware/DraftAware'
import { JsonLd } from '@/components/JsonLd/JsonLd'
import { getVisitEdition } from '@/data/editions'
import { makePageMetadata, visitFaqJsonLd } from '@/lib/seo'
import { type DynamicFetchOptions } from '@/sanity/lib/live'
import { getVisitPage } from '@/sanity/lib/staticPages'

export const generateMetadata = makePageMetadata(getVisitPage, {
  title: 'Visit',
  path: '/visit',
})

export default function VisitRoute() {
  return (
    <>
      <main>
        <DraftAware
          cached={(options) => <CachedVisit options={options} />}
          fallback={<VisitSection />}
        />
      </main>
    </>
  )
}

async function CachedVisit({ options }: { options: DynamicFetchOptions }) {
  'use cache'
  const [page, visitEdition] = await Promise.all([getVisitPage(options), getVisitEdition(options)])
  const faq = page?.faq ?? []
  return (
    <>
      <VisitSection {...(page?.section ?? {})} />
      {/* Venues view only when the resolved edition has a programme to show. */}
      {visitEdition ? (
        <VenuesView year={visitEdition.year} sections={visitEdition.sections} />
      ) : null}
      <VisitFaq entries={faq} />
      {faq.length > 0 && <JsonLd data={visitFaqJsonLd(faq)} />}
    </>
  )
}
