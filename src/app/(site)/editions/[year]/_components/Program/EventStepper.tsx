import { eventModal } from '@program/EventModal.recipe'
import type { EventSteps } from '@program/event-steps'
import { RiArrowLeftSLine, RiArrowRightSLine } from '@remixicon/react'
import Link from 'next/link'
import { Text } from 'styled-system/jsx'
import { Button } from '@/components/ui/Button/Button'

const s = eventModal()

export function EventStepper({ prev, next, index, total }: EventSteps) {
  if (index === undefined || total === undefined) return null

  return (
    <div className={s.steps}>
      {prev ? (
        <Button asChild variant="icon">
          <Link href={prev.href} replace scroll={false} aria-label={`Previous event: ${prev.name}`}>
            <RiArrowLeftSLine size={22} aria-hidden />
          </Link>
        </Button>
      ) : (
        <Button variant="icon" disabled aria-label="Previous event">
          <RiArrowLeftSLine size={22} aria-hidden />
        </Button>
      )}

      <Text as="span" variant="caption" className={s.count}>
        {index + 1} of {total}
      </Text>

      {next ? (
        <Button asChild variant="icon">
          <Link href={next.href} replace scroll={false} aria-label={`Next event: ${next.name}`}>
            <RiArrowRightSLine size={22} aria-hidden />
          </Link>
        </Button>
      ) : (
        <Button variant="icon" disabled aria-label="Next event">
          <RiArrowRightSLine size={22} aria-hidden />
        </Button>
      )}
    </div>
  )
}
