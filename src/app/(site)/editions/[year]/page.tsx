import { CachedEdition } from '@/app/(site)/editions/[year]/edition-content'
import { EditionsNav } from '@/components/EditionsNav/EditionsNav'
import { getAllEditionYearParams, getEditionForMetadata } from '@/data/editions'
import { editionMetadata } from '@/lib/seo'
import { getDynamicFetchOptions } from '@/sanity/lib/live'

export async function generateStaticParams() {
  return getAllEditionYearParams()
}

export async function generateMetadata(props: PageProps<'/editions/[year]'>) {
  const [{ year }, { perspective }] = await Promise.all([props.params, getDynamicFetchOptions()])
  const edition = await getEditionForMetadata(Number(year), perspective)
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
      <EditionsNav />
    </>
  )
}
