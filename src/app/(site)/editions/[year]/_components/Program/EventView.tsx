import { EventDetail } from '@program/EventDetail'
import { RailStepper } from '@program/EventStepper'
import { eventView } from '@program/EventView.recipe'
import type { EventSteps } from '@program/event-steps'
import { PROGRAM_LABELS } from '@program/program-labels'
import type { ProgramScope } from '@program/program-scope'
import { RiArrowLeftLine } from '@remixicon/react'
import Link from 'next/link'
import { Container, Text } from 'styled-system/jsx'
import { Button } from '@/components/ui/Button/Button'
import type { CalendarEvent } from '@/types/edition'

const s = eventView()

export function EventView({
  event,
  scope,
  theme,
  steps,
}: {
  event: CalendarEvent
  scope: ProgramScope
  theme: string
  steps: EventSteps
}) {
  return (
    <main className={s.page}>
      <Container>
        <div className={s.crumb}>
          <Button asChild variant="quiet" size="sm">
            <Link href={scope.programHref}>
              <RiArrowLeftLine size={16} aria-hidden />
              {scope.backLabel}
            </Link>
          </Button>
          <Text as="span" variant="label" className={s.theme}>
            {theme}
          </Text>
        </div>

        <div className={s.detail}>
          <EventDetail event={event} shell="page" scope={scope} />
        </div>

        <RailStepper steps={steps} labels={PROGRAM_LABELS[scope.lang]} />
      </Container>
    </main>
  )
}
