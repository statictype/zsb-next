import { eventStepper } from '@program/EventStepper.recipe'
import type { EventStep, EventSteps } from '@program/event-steps'
import {
  RiArrowLeftLine,
  RiArrowLeftSLine,
  RiArrowRightLine,
  RiArrowRightSLine,
} from '@remixicon/react'
import Link from 'next/link'
import { Text } from 'styled-system/jsx'
import { Button } from '@/components/ui/Button/Button'

type Dir = 'prev' | 'next'

const LABEL: Record<Dir, string> = { prev: 'Previous event', next: 'Next event' }

const modal = eventStepper({ chrome: 'modal' })
const rail = eventStepper({ chrome: 'rail' })

function StepCount({
  className,
  index,
  total,
}: {
  className: string | undefined
  index: number
  total: number
}) {
  return (
    <Text as="span" variant="caption" className={className}>
      {index + 1} of {total}
    </Text>
  )
}

function ModalStep({ step, dir }: { step: EventStep; dir: Dir }) {
  const Arrow = dir === 'prev' ? RiArrowLeftSLine : RiArrowRightSLine
  return (
    <Button asChild variant="icon">
      <Link href={step.href} replace scroll={false} aria-label={`${LABEL[dir]}: ${step.name}`}>
        <Arrow size={22} aria-hidden />
      </Link>
    </Button>
  )
}

function ModalEnd({ dir }: { dir: Dir }) {
  const Arrow = dir === 'prev' ? RiArrowLeftSLine : RiArrowRightSLine
  return (
    <Button variant="icon" disabled aria-label={LABEL[dir]}>
      <Arrow size={22} aria-hidden />
    </Button>
  )
}

// `<a>`, not `<Link>`: the `@modal` slot intercepts soft navigations to an event
// URL from anywhere under `/editions/[year]`, including from this page, which
// would stack the next event's modal over the page being read.
function RailStep({ step, dir }: { step: EventStep; dir: Dir }) {
  const Arrow = dir === 'prev' ? RiArrowLeftLine : RiArrowRightLine
  return (
    <a className={rail.step} href={step.href} data-dir={dir}>
      <Text as="span" variant="label" className={rail.stepLabel}>
        {dir === 'prev' && <Arrow size={14} aria-hidden />}
        {LABEL[dir]}
        {dir === 'next' && <Arrow size={14} aria-hidden />}
      </Text>
      <Text as="span" variant="body" className={rail.stepName} data-step-name>
        {step.name}
      </Text>
    </a>
  )
}

export function ModalStepper({ steps }: { steps: EventSteps }) {
  const { prev, next, index, total } = steps
  if (index === undefined || total === undefined) return null

  return (
    <div className={modal.root}>
      {prev ? <ModalStep step={prev} dir="prev" /> : <ModalEnd dir="prev" />}
      <StepCount className={modal.count} index={index} total={total} />
      {next ? <ModalStep step={next} dir="next" /> : <ModalEnd dir="next" />}
    </div>
  )
}

export function RailStepper({ steps }: { steps: EventSteps }) {
  const { prev, next, index, total } = steps
  if (index === undefined || total === undefined) return null

  return (
    <nav className={rail.root} aria-label="Previous and next events">
      {prev ? <RailStep step={prev} dir="prev" /> : <span className={rail.end} />}
      <StepCount className={rail.count} index={index} total={total} />
      {next ? <RailStep step={next} dir="next" /> : <span className={rail.end} />}
    </nav>
  )
}
