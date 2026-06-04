import { draftMode } from 'next/headers'
import { Suspense } from 'react'
import { Navigation } from '@/components/Navigation/Navigation'
import {
  type Amenity,
  type TransportRoute,
  VisitSection,
} from '@/components/VisitSection/VisitSection'
import { pageMetadata } from '@/lib/seo'
import { urlFor } from '@/sanity/lib/image'
import { type DynamicFetchOptions, getDynamicFetchOptions } from '@/sanity/lib/live'
import { getVisitPage, type VisitPage } from '@/sanity/lib/staticPages'

export async function generateMetadata() {
  const { perspective } = await getDynamicFetchOptions()
  const page = await getVisitPage({ perspective, stega: false })
  return pageMetadata({
    title: 'Visit',
    description:
      'Plan your visit to Bucharest Sculpture Days at Combinatul Fondului Plastic — address, hours, transport, and amenities.',
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
  return <VisitSection {...mapVisit(page)} />
}

type Mapped = Parameters<typeof VisitSection>[0]

function mapVisit(page: VisitPage | null): Mapped {
  if (!page) return {}
  const image = page.image?.asset
    ? { src: urlFor(page.image).url(), alt: page.image.alt ?? '' }
    : null
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
