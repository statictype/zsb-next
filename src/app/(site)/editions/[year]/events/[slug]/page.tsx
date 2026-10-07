import { EventView } from '@program/EventView'
import { eventSteps } from '@program/event-steps'
import { notFound } from 'next/navigation'
import { DraftAware } from '@/components/DraftAware/DraftAware'
import { JsonLd } from '@/components/JsonLd/JsonLd'
import { editionProgramScope } from '@/lib/edition-href'
import { eventBreadcrumbJsonLd, eventJsonLd, eventMetadata } from '@/lib/seo'
import { getAllEventParams, getEdition } from '@/sanity/lib/editions'
import { type DynamicFetchOptions, getDynamicFetchOptions } from '@/sanity/lib/live'
import { findEvent } from '@/types/edition'

// No og:image here — the sibling opengraph-image route supplies it.
export async function generateMetadata(props: PageProps<'/editions/[year]/events/[slug]'>) {
  const [{ year, slug }, { perspective }] = await Promise.all([
    props.params,
    getDynamicFetchOptions(),
  ])
  const edition = await getEdition(Number(year), { perspective })
  const event = findEvent(edition, slug)
  return event ? eventMetadata(Number(year), event) : {}
}

export async function generateStaticParams() {
  return getAllEventParams()
}

// Renders only on a cold load: soft navigation from the program is intercepted
// by the sibling `@modal` slot, which opens the same event as a modal instead.
export default async function EventPage(props: PageProps<'/editions/[year]/events/[slug]'>) {
  const { year, slug } = await props.params
  return (
    <DraftAware
      cached={(options) => <EventBody year={Number(year)} slug={slug} options={options} />}
      fallback={null}
    />
  )
}

async function EventBody({
  year,
  slug,
  options,
}: {
  year: number
  slug: string
  options: DynamicFetchOptions
}) {
  const edition = await getEdition(year, options)
  const event = findEvent(edition, slug)
  if (!edition || !event) notFound()

  return (
    <>
      <JsonLd data={eventJsonLd(edition.year, event)} />
      <JsonLd data={eventBreadcrumbJsonLd(edition.year, edition.theme, event)} />
      <EventView
        event={event}
        scope={editionProgramScope(edition.year)}
        theme={edition.theme}
        steps={eventSteps(edition.events, slug, editionProgramScope(edition.year))}
      />
    </>
  )
}
