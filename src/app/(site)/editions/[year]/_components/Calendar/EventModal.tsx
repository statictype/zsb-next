'use client'

import { EventDetail } from '@calendar/EventDetail'
import { eventModal } from '@calendar/EventModal.recipe'
import { EventStepper } from '@calendar/EventStepper'
import type { EventSteps } from '@calendar/event-steps'
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
            {year} calendar
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
