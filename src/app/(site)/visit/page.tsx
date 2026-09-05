import { VisitFaq } from '@site/visit/_components/VisitFaq'
import { VisitSection } from '@site/visit/_components/VisitSection'
import { notFound } from 'next/navigation'
import { DraftAware } from '@/components/DraftAware/DraftAware'
import { JsonLd } from '@/components/JsonLd/JsonLd'
import { PageHero } from '@/components/PageHero/PageHero'
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
  const page = await getVisitPage(options)
  if (!page) notFound()
  const { faq } = page
  return (
    <main>
      <PageHero flush title="Plan your visit" />
      <VisitSection {...page.section} />
      <VisitFaq entries={faq} />
      {faq.length > 0 && <JsonLd data={visitFaqJsonLd(faq)} />}
    </main>
  )
}
