import { DraftAware } from '@/components/DraftAware/DraftAware'
import { EditionsNavBand } from '@/components/EditionsNav/EditionsNavBand'
import { getEditionListItems } from '@/data/editions'
import { type DynamicFetchOptions } from '@/sanity/lib/live'

/**
 * Full-width "browse the editions" band, placed just above the footer on the
 * edition pages, About, and Partners. Self-contained: it's `DraftAware`'s
 * page→dynamic→cached triplet (ADR 0012) already wired up, so a page just
 * renders `<EditionsNav />` with no Suspense wrapper of its own.
 */
export function EditionsNav() {
  return (
    <DraftAware cached={(options) => <CachedEditionsNav options={options} />} fallback={null} />
  )
}

async function CachedEditionsNav({ options }: { options: DynamicFetchOptions }) {
  'use cache'
  // `getEditionListItems` is already sorted year-desc. The band declares the
  // slice it reads (`EditionEntry` picks off `EditionListItem`), so the list
  // passes through unmapped; link/plate policy lives in the band.
  const editions = await getEditionListItems(options)
  if (editions.length === 0) return null
  return <EditionsNavBand editions={editions} />
}
