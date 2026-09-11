'use client'

import { EventDetail } from '@program/EventDetail'
import { eventModal } from '@program/EventModal.recipe'
import { EventStepper } from '@program/EventStepper'
import type { EventSteps } from '@program/event-steps'
import { RiArrowLeftLine, RiCloseLine } from '@remixicon/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button/Button'
import { Dialog } from '@/components/ui/Dialog/Dialog'
import type { CalendarEvent } from '@/types/edition'

const s = eventModal()

// Only the `@modal` slot renders this, and it only fills on a soft navigation
// from the edition page — so there is always an entry of ours to pop.
export function EventModal({
  event,
  year,
  steps,
}: {
  event: CalendarEvent
  year: number
  steps: EventSteps
}) {
  const router = useRouter()
  const onClose = () => router.back()

  return (
    <Dialog open onClose={onClose} title={event.name} presentation="fullscreen">
      <div className={s.shell}>
        <header className={s.chrome}>
          <Button variant="quiet" size="sm" onClick={onClose}>
            <RiArrowLeftLine size={16} aria-hidden />
            {year} program
          </Button>

          <EventStepper steps={steps} chrome="modal" />

          <Button variant="icon" onClick={onClose} aria-label="Close">
            <RiCloseLine size={22} aria-hidden />
          </Button>
        </header>

        <EventDetail event={event} shell="modal" />
      </div>
    </Dialog>
  )
}
