import { eventSteps } from '@calendar/event-steps'
import { RoutedEventModal } from '@calendar/RoutedEventModal'
import { notFound } from 'next/navigation'
import { getEdition } from '@/data/editions'
import { getDynamicFetchOptions } from '@/sanity/lib/live'
import { findEvent } from '@/types/edition'

// `(.)` intercepts the sibling `events/[slug]` segment, so a soft navigation
// renders here over the mounted edition. Hard loads hit the real route.
export default async function InterceptedEventModal(
  props: PageProps<'/editions/[year]/events/[slug]'>,
) {
  const [{ year, slug }, options] = await Promise.all([props.params, getDynamicFetchOptions()])
  const edition = await getEdition(Number(year), options)
  const event = findEvent(edition, slug)
  if (!event) notFound()

  return (
    <RoutedEventModal
      event={event}
      year={Number(year)}
      {...eventSteps(edition?.events ?? [], slug, Number(year))}
    />
  )
}
