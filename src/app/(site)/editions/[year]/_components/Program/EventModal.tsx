'use client'

import { EventDetail } from '@program/EventDetail'
import { eventModal } from '@program/EventModal.recipe'
import { EventStepper } from '@program/EventStepper'
import type { EventSteps } from '@program/event-steps'
import { RiArrowLeftLine, RiCloseLine } from '@remixicon/react'
import { Button } from '@/components/ui/Button/Button'
import { Dialog } from '@/components/ui/Dialog/Dialog'
import type { CalendarEvent } from '@/types/edition'

const s = eventModal()

export function EventModal({
  event,
  year,
  prev,
  next,
  index,
  total,
  onClose,
}: {
  event: CalendarEvent
  year: number
  onClose: () => void
} & EventSteps) {
  return (
    <Dialog open onClose={onClose} title={event.name} presentation="fullscreen">
      <div className={s.shell}>
        <header className={s.chrome}>
          <Button variant="quiet" size="sm" onClick={onClose}>
            <RiArrowLeftLine size={16} aria-hidden />
            {year} program
          </Button>

          <EventStepper prev={prev} next={next} index={index} total={total} />

          <Button variant="icon" onClick={onClose} aria-label="Close">
            <RiCloseLine size={22} aria-hidden />
          </Button>
        </header>

        <EventDetail event={event} shell="modal" />
      </div>
    </Dialog>
  )
}
