import { notFound } from 'next/navigation'
import { RoutedEventModal } from '@/components/Calendar/RoutedEventModal'
import { getAllEditionYears, getEdition } from '@/data/editions'
import { eventMetadata } from '@/lib/seo'
import { type DynamicFetchOptions, getDynamicFetchOptions } from '@/sanity/lib/live'
import { findEvent } from '@/types/edition'
import { CachedEdition, loadEdition } from '../../edition-content'

const PUBLISHED: DynamicFetchOptions = { perspective: 'published', stega: false }

// Title + description for a shared event link; the share card (og:image) is the
// sibling opengraph-image route. Metadata always strips stega (perspective
// resolved, stega: false) and caches nothing — safe under ADR 0012.
export async function generateMetadata(props: PageProps<'/editions/[year]/events/[slug]'>) {
  const [{ year, slug }, { perspective }] = await Promise.all([
    props.params,
    getDynamicFetchOptions(),
  ])
  const edition = await getEdition(Number(year), { perspective, stega: false })
  const event = findEvent(edition, slug)
  return event ? eventMetadata(Number(year), event) : {}
}

// Prerender one page per event — a slug-keyed route is statically optimisable
// (it reads the already-cached edition and picks the event by slug), which a
// `?event=` query never was (ADR 0015). Each renders the cached edition body, so
// the N event pages share its one cache entry.
export async function generateStaticParams() {
  const years = await getAllEditionYears()
  const params: { year: string; slug: string }[] = []
  for (const year of years) {
    const edition = await getEdition(year, PUBLISHED)
    if (!edition) continue
    for (const event of edition.events ?? []) {
      params.push({ year: String(year), slug: event.slug })
    }
  }
  return params
}

// A hard load / refresh / shared link of an event URL: there is no standalone
// event page — we render the full edition with the event's modal over it. Soft
// navigation from the calendar is intercepted by the sibling `@modal` slot
// instead, so this renders only when the slot can't (cold load).
export default async function EventPage(props: PageProps<'/editions/[year]/events/[slug]'>) {
  const [{ year, slug }, options] = await Promise.all([props.params, getDynamicFetchOptions()])
  const edition = await loadEdition(Number(year), options)
  const event = findEvent(edition, slug)
  if (!event) notFound()

  return (
    <>
      <CachedEdition year={Number(year)} options={options} />
      <RoutedEventModal event={event} intercepted={false} editionHref={`/editions/${year}`} />
    </>
  )
}
