import { draftMode } from 'next/headers'
import { Suspense } from 'react'
import { JsonLd } from '@/components/JsonLd/JsonLd'
import { Navigation } from '@/components/Navigation/Navigation'
import { VisitFaq } from '@/components/VisitFaq/VisitFaq'
import {
  type Amenity,
  type TransportRoute,
  VisitSection,
} from '@/components/VisitSection/VisitSection'
import { SITE_DESCRIPTION, SITE_NAME } from '@/lib/constants'
import { type FaqEntry, pageMetadata, visitFaqJsonLd } from '@/lib/seo'
import { toImageData } from '@/sanity/lib/image'
import { type DynamicFetchOptions, getDynamicFetchOptions } from '@/sanity/lib/live'
import { getVisitPage, type VisitPage } from '@/sanity/lib/staticPages'

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

export default async function VisitRoute() {
  const { isEnabled: isDraftMode } = await draftMode()
  if (isDraftMode) {
    return (
      <>
        <Navigation activeId={null} />
        <main>
          <Suspense fallback={<VisitSection />}>
            <DynamicVisit />
          </Suspense>
        </main>
      </>
    )
  }
  return (
    <>
      <Navigation activeId={null} />
      <main>
        <CachedVisit options={{ perspective: 'published', stega: false }} />
      </main>
    </>
  )
}

async function DynamicVisit() {
  const options = await getDynamicFetchOptions()
  return <CachedVisit options={options} />
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

// Merge the Visit FAQ from two sources. The opening-hours and location entries
// are DERIVED from the structured fields (read at render time, so they can't
// drift from what the page displays) and scoped to "during the event" so the
// answers aren't mistaken for the venue's year-round schedule. Editorial
// entries — tickets, accessibility, the year-round venue — come from the
// optional `faq` array. Both feed the visible FAQ and the JSON-LD.
function buildFaq(page: VisitPage | null): FaqEntry[] {
  if (!page) return []
  const entries: FaqEntry[] = []

  const hours = (page.hoursLines ?? []).filter(Boolean)
  if (hours.length > 0) {
    entries.push({
      question: `What are the opening hours during ${SITE_NAME}?`,
      answer: `${hours.join('. ')}. These hours apply during the event.`,
    })
  }
  if (page.street && page.city) {
    entries.push({
      question: `Where is ${SITE_NAME} held?`,
      answer: `The main venue is at ${page.street}, ${page.city}. The program also extends to partner venues and public locations across Bucharest.`,
    })
  }

  for (const item of page.faq ?? []) {
    if (item.question && item.answer) {
      entries.push({ question: item.question, answer: item.answer })
    }
  }

  return entries
}

type Mapped = Parameters<typeof VisitSection>[0]

function mapVisit(page: VisitPage | null): Mapped {
  if (!page) return {}
  const image = toImageData(page.image) ?? null
  return {
    venueName: page.venueName ?? null,
    street: page.street ?? null,
    city: page.city ?? null,
    mapsUrl: page.mapsUrl ?? null,
    image,
    hoursLines: page.hoursLines ?? null,
    amenities: (page.amenities ?? null) as Amenity[] | null,
    transport: (page.transport ?? null) as TransportRoute[] | null,
  }
}
