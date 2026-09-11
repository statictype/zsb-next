import { EventView } from '@program/EventView'
import { eventSteps } from '@program/event-steps'
import { notFound } from 'next/navigation'
import { JsonLd } from '@/components/JsonLd/JsonLd'
import { getAllEventParams, getEdition, getEditionForMetadata } from '@/data/editions'
import { eventBreadcrumbJsonLd, eventJsonLd, eventMetadata } from '@/lib/seo'
import { getDynamicFetchOptions } from '@/sanity/lib/live'
import { findEvent } from '@/types/edition'

// No og:image here — the sibling opengraph-image route supplies it.
export async function generateMetadata(props: PageProps<'/editions/[year]/events/[slug]'>) {
  const [{ year, slug }, { perspective }] = await Promise.all([
    props.params,
    getDynamicFetchOptions(),
  ])
  const edition = await getEditionForMetadata(Number(year), perspective)
  const event = findEvent(edition, slug)
  return event ? eventMetadata(Number(year), event) : {}
}

export async function generateStaticParams() {
  return getAllEventParams()
}

// Renders only on a cold load: soft navigation from the program is intercepted
// by the sibling `@modal` slot, which opens the same event as a modal instead.
export default async function EventPage(props: PageProps<'/editions/[year]/events/[slug]'>) {
  const [{ year, slug }, options] = await Promise.all([props.params, getDynamicFetchOptions()])
  const edition = await getEdition(Number(year), options)
  const event = findEvent(edition, slug)
  if (!edition || !event) notFound()

  return (
    <>
      <JsonLd data={eventJsonLd(edition.year, event)} />
      <JsonLd data={eventBreadcrumbJsonLd(edition.year, edition.theme, event)} />
      <EventView
        event={event}
        year={edition.year}
        theme={edition.theme}
        steps={eventSteps(edition.events, slug, edition.year)}
      />
    </>
  )
}
