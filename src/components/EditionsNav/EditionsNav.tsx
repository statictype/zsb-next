import { Suspense } from 'react'
import { DraftAware } from '@/components/DraftAware/DraftAware'
import { EditionsNavBand, EditionsNavBandList } from '@/components/EditionsNav/EditionsNavBand'
import { getEditionSummaries } from '@/sanity/lib/editions'
import { type DynamicFetchOptions } from '@/sanity/lib/live'

export function EditionsNav() {
  return (
    <DraftAware cached={(options) => <CachedEditionsNav options={options} />} fallback={null} />
  )
}

async function CachedEditionsNav({ options }: { options: DynamicFetchOptions }) {
  'use cache'
  const editions = await getEditionSummaries(options)
  if (editions.length === 0) return null
  // The band reads `usePathname()` — runtime data under `cacheComponents` when
  // the route's params aren't known at build time. Without this boundary the
  // `/editions/[year]` fallback shell fails to prerender.
  return (
    <Suspense fallback={<EditionsNavBandList editions={editions} pathname={null} />}>
      <EditionsNavBand editions={editions} />
    </Suspense>
  )
}
