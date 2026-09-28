import { EventView } from '@program/EventView'
import { eventSteps } from '@program/event-steps'
import { notFound } from 'next/navigation'
import { JsonLd } from '@/components/JsonLd/JsonLd'
import { bellerProgramScope } from '@/lib/galeria-beller-href'
import { bellerEventMetadata, bellerSubEventJsonLd } from '@/lib/seo'
import { getGaleriaBeller } from '@/sanity/lib/galeria-beller'
import { getDynamicFetchOptions, PUBLISHED } from '@/sanity/lib/live'
import { findEvent } from '@/types/edition'

export async function generateMetadata(props: PageProps<'/galeria-beller/evenimente/[slug]'>) {
  const [{ slug }, { perspective }] = await Promise.all([props.params, getDynamicFetchOptions()])
  const page = await getGaleriaBeller({ perspective })
  const event = findEvent(page, slug)
  return page && event ? bellerEventMetadata(page, event) : {}
}

export async function generateStaticParams() {
  const page = await getGaleriaBeller(PUBLISHED)
  return (page?.events ?? []).map((event) => ({ slug: event.slug }))
}

export default async function BellerEventPage(
  props: PageProps<'/galeria-beller/evenimente/[slug]'>,
) {
  const [{ slug }, options] = await Promise.all([props.params, getDynamicFetchOptions()])
  const page = await getGaleriaBeller(options)
  const event = findEvent(page, slug)
  if (!page || !event) notFound()

  return (
    <>
      <JsonLd data={bellerSubEventJsonLd(page, event)} />
      <EventView
        event={event}
        scope={bellerProgramScope}
        theme={page.title}
        steps={eventSteps(page.events, slug, bellerProgramScope)}
      />
    </>
  )
}
