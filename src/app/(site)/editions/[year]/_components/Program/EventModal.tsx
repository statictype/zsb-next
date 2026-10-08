'use client'

import { EventDetail, POSTER_SIZES } from '@program/EventDetail'
import { eventModal } from '@program/EventModal.recipe'
import { ModalStepper } from '@program/EventStepper'
import { type EventStep, eventSteps } from '@program/event-steps'
import { PROGRAM_LABELS } from '@program/program-labels'
import type { ProgramScope } from '@program/program-scope'
import { RiArrowLeftLine, RiCloseLine } from '@remixicon/react'
import { getImageProps } from 'next/image'
import { useParams, useRouter } from 'next/navigation'
import { type ReactNode, type Ref, useRef, useState } from 'react'
import { preload } from 'react-dom'
import { Button } from '@/components/ui/Button/Button'
import { DialogTitle } from '@/components/ui/Dialog/Dialog'
import { editionProgramScope } from '@/lib/edition-href'
import type { CalendarEvent } from '@/types/edition'

const s = eventModal()

function preloadPoster(event: CalendarEvent | undefined) {
  if (!event?.image) return
  const { props } = getImageProps({
    src: event.image.src,
    alt: '',
    fill: true,
    sizes: POSTER_SIZES,
  })
  if (!props.srcSet) return
  preload(props.src, { as: 'image', imageSrcSet: props.srcSet, imageSizes: POSTER_SIZES })
}

function ModalChrome({
  scope,
  onClose,
  ref,
  children,
}: {
  scope: ProgramScope
  onClose: () => void
  ref?: Ref<HTMLElement>
  children: ReactNode
}) {
  return (
    <header ref={ref} className={s.chrome}>
      <Button variant="quiet" size="sm" onClick={onClose}>
        <RiArrowLeftLine size={16} aria-hidden />
        {scope.backLabel}
      </Button>

      {children}

      <Button variant="icon" onClick={onClose} aria-label={PROGRAM_LABELS[scope.lang].close}>
        <RiCloseLine size={22} aria-hidden />
      </Button>
    </header>
  )
}

export function EventModalLoadingChrome({ children }: { children: ReactNode }) {
  const { year } = useParams<{ year: string }>()
  const router = useRouter()
  return (
    <ModalChrome scope={editionProgramScope(Number(year))} onClose={() => router.back()}>
      {children}
    </ModalChrome>
  )
}

// Only the `@modal` slot renders this, so history always holds an entry of
// ours to pop.
export function EventModal({
  events,
  slug: initialSlug,
  scope,
}: {
  events: CalendarEvent[]
  slug: string
  scope: ProgramScope
}) {
  const labels = PROGRAM_LABELS[scope.lang]
  const router = useRouter()
  const headerRef = useRef<HTMLElement>(null)
  const [slug, setSlug] = useState(initialSlug)
  const onClose = () => router.back()

  const event = events.find((e) => e.slug === slug)
  if (!event) return null

  const steps = eventSteps(events, slug, scope)
  const bySlug = (step: EventStep | undefined) => events.find((e) => e.slug === step?.slug)
  preloadPoster(bySlug(steps.prev))
  preloadPoster(bySlug(steps.next))

  const onStep = (step: EventStep) => {
    window.history.replaceState(null, '', step.href)
    setSlug(step.slug)
    headerRef.current?.parentElement?.scrollTo({ top: 0 })
  }

  return (
    <>
      <DialogTitle>{event.name}</DialogTitle>
      <ModalChrome ref={headerRef} scope={scope} onClose={onClose}>
        <ModalStepper steps={steps} onStep={onStep} labels={labels} />
      </ModalChrome>

      <EventDetail key={event.slug} event={event} shell="modal" scope={scope} />
    </>
  )
}
