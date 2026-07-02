import { DraftAware } from '@/components/DraftAware/DraftAware'
import { getEditionListItems } from '@/data/editions'
import { type DynamicFetchOptions } from '@/sanity/lib/live'
import { EditionsNavBand } from './EditionsNavBand'

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
  // `getEditionListItems` is already sorted year-desc. Live editions link to
  // their (reachable) page; upcoming ones are shown as non-clickable "Soon"
  // plates — their route is gated `status != "upcoming"`, so there's nothing
  // to link to yet.
  const editions = await getEditionListItems(options)
  if (editions.length === 0) return null
  return (
    <EditionsNavBand
      editions={editions.map((e) => ({
        year: e.year,
        theme: e.theme,
        themeHighlight: e.themeHighlight,
        status: e.status,
      }))}
    />
  )
}
