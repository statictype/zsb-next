import { EventModal } from '@program/EventModal'
import { notFound } from 'next/navigation'
import { getEdition } from '@/sanity/lib/editions'
import { getDynamicFetchOptions } from '@/sanity/lib/live'
import { findEvent } from '@/types/edition'

// `(.)` intercepts the sibling `events/[slug]` segment, so a soft navigation
// renders here over the mounted edition. Hard loads hit the real route.
export default async function InterceptedEventModal(
  props: PageProps<'/editions/[year]/events/[slug]'>,
) {
  const [{ year, slug }, options] = await Promise.all([props.params, getDynamicFetchOptions()])
  const edition = await getEdition(Number(year), options)
  if (!edition || !findEvent(edition, slug)) notFound()

  return <EventModal events={edition.events} slug={slug} year={Number(year)} />
}
