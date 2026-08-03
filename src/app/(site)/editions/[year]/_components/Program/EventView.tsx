import { EventDetail } from '@program/EventDetail'
import { EventStepRail } from '@program/EventStepRail'
import { eventView } from '@program/EventView.recipe'
import type { EventSteps } from '@program/event-steps'
import { RiArrowLeftLine } from '@remixicon/react'
import Link from 'next/link'
import { Container, Text } from 'styled-system/jsx'
import { Button } from '@/components/ui/Button/Button'
import { editionProgramHref } from '@/lib/edition-href'
import type { CalendarEvent } from '@/types/edition'

const s = eventView()

export function EventView({
  event,
  year,
  theme,
  ...steps
}: {
  event: CalendarEvent
  year: number
  theme: string
} & EventSteps) {
  return (
    <main className={s.page}>
      <Container>
        <div className={s.crumb}>
          <Button asChild variant="quiet" size="sm">
            <Link href={editionProgramHref(year)}>
              <RiArrowLeftLine size={16} aria-hidden />
              {year} program
            </Link>
          </Button>
          <Text as="span" variant="label" className={s.theme}>
            {theme}
          </Text>
        </div>

        <div className={s.detail}>
          <EventDetail event={event} shell="page" />
        </div>

        <EventStepRail {...steps} />
      </Container>
    </main>
  )
}
