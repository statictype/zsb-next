import { RoutedEventModal } from '@calendar/RoutedEventModal'
import { notFound } from 'next/navigation'
import { getEdition } from '@/data/editions'
import { editionHref } from '@/lib/edition-href'
import { getDynamicFetchOptions } from '@/sanity/lib/live'
import { findEvent } from '@/types/edition'

// Soft navigation from the calendar (a `<Link>` to the event URL) is intercepted
// here and rendered into the `@modal` slot, over the already-mounted edition
// (ADR 0015). `(.)` intercepts the sibling `events/[slug]` segment at this level.
// Hard loads bypass interception and hit the real route instead.
export default async function InterceptedEventModal(
  props: PageProps<'/editions/[year]/events/[slug]'>,
) {
  const [{ year, slug }, options] = await Promise.all([props.params, getDynamicFetchOptions()])
  const edition = await getEdition(Number(year), options)
  const event = findEvent(edition, slug)
  if (!event) notFound()

  return <RoutedEventModal event={event} intercepted editionHref={editionHref(Number(year))} />
}
