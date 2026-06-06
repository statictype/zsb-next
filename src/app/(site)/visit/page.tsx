import { DraftAware } from '@/components/DraftAware/DraftAware'
import { JsonLd } from '@/components/JsonLd/JsonLd'
import { Navigation } from '@/components/Navigation/Navigation'
import { VisitFaq } from '@/components/VisitFaq/VisitFaq'
import { VisitSection } from '@/components/VisitSection/VisitSection'
import { SITE_DESCRIPTION } from '@/lib/constants'
import { pageMetadata, visitFaqJsonLd } from '@/lib/seo'
import { type DynamicFetchOptions, getDynamicFetchOptions } from '@/sanity/lib/live'
import { buildFaq, getVisitPage, mapVisit } from '@/sanity/lib/staticPages'

export async function generateMetadata() {
  const { perspective } = await getDynamicFetchOptions()
  const page = await getVisitPage({ perspective, stega: false })
  return pageMetadata({
    title: 'Visit',
    description: page?.metaDescription ?? SITE_DESCRIPTION,
    path: '/visit',
    shareImage: page?.ogImage,
  })
}

export default function VisitRoute() {
  return (
    <>
      <Navigation activeId={null} />
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
  const page = await getVisitPage(options)
  const faq = buildFaq(page)
  return (
    <>
      <VisitSection {...mapVisit(page)} />
      <VisitFaq entries={faq} />
      {faq.length > 0 && <JsonLd data={visitFaqJsonLd(faq)} />}
    </>
  )
}
