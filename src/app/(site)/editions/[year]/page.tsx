import { Suspense } from 'react'
import { EditionsNav } from '@/components/EditionsNav/EditionsNav'
import { getAllEditionYears, getEdition } from '@/data/editions'
import { editionMetadata } from '@/lib/seo'
import { getDynamicFetchOptions } from '@/sanity/lib/live'
import { CachedEdition } from './edition-content'

export async function generateStaticParams() {
  const years = await getAllEditionYears()
  return years.map((year) => ({ year: String(year) }))
}

export async function generateMetadata(props: PageProps<'/editions/[year]'>) {
  const [{ year }, { perspective }] = await Promise.all([props.params, getDynamicFetchOptions()])
  // Metadata never carries stega — stripping is built into the editions
  // helper via the perspective + stega args.
  const edition = await getEdition(Number(year), { perspective, stega: false })
  return edition ? editionMetadata(edition) : {}
}

// Sibling loading.tsx provides the Suspense fallback — see Next 16
// Cache Components docs ("Routes with loading.tsx" pattern). The body lives in
// `edition-content.tsx` so the per-event route (`events/[key]`) can render the
// same cached edition with the modal over it (ADR 0015).
export default async function EditionPage(props: PageProps<'/editions/[year]'>) {
  const [{ year }, options] = await Promise.all([props.params, getDynamicFetchOptions()])
  return (
    <>
      <CachedEdition year={Number(year)} options={options} />
      <Suspense>
        <EditionsNav />
      </Suspense>
    </>
  )
}
