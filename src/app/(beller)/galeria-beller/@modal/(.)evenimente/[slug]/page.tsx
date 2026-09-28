import { EventModal } from '@program/EventModal'
import { notFound } from 'next/navigation'
import { bellerProgramScope } from '@/lib/galeria-beller-href'
import { getGaleriaBeller } from '@/sanity/lib/galeria-beller'
import { getDynamicFetchOptions } from '@/sanity/lib/live'
import { findEvent } from '@/types/edition'

export default async function InterceptedBellerEventModal(
  props: PageProps<'/galeria-beller/evenimente/[slug]'>,
) {
  const [{ slug }, options] = await Promise.all([props.params, getDynamicFetchOptions()])
  const page = await getGaleriaBeller(options)
  if (!page || !findEvent(page, slug)) notFound()

  return <EventModal events={page.events} slug={slug} scope={bellerProgramScope} />
}
