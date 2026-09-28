import { eventStepper } from '@program/EventStepper.recipe'
import type { EventStep, EventSteps } from '@program/event-steps'
import type { ProgramLabels } from '@program/program-labels'
import {
  RiArrowLeftLine,
  RiArrowLeftSLine,
  RiArrowRightLine,
  RiArrowRightSLine,
} from '@remixicon/react'
import { Text } from 'styled-system/jsx'
import { Button } from '@/components/ui/Button/Button'

type Dir = 'prev' | 'next'

type StepperLabels = Pick<ProgramLabels, 'prevEvent' | 'nextEvent' | 'stepCount' | 'stepperNav'>

function dirLabel(labels: StepperLabels, dir: Dir): string {
  return dir === 'prev' ? labels.prevEvent : labels.nextEvent
}

const modal = eventStepper({ chrome: 'modal' })
const rail = eventStepper({ chrome: 'rail' })

function StepCount({
  className,
  index,
  total,
  labels,
}: {
  className: string | undefined
  index: number
  total: number
  labels: StepperLabels
}) {
  return (
    <Text as="span" variant="caption" className={className}>
      {labels.stepCount(index + 1, total)}
    </Text>
  )
}

function ModalStep({
  step,
  dir,
  onStep,
  labels,
}: {
  step: EventStep
  dir: Dir
  onStep: (step: EventStep) => void
  labels: StepperLabels
}) {
  const Arrow = dir === 'prev' ? RiArrowLeftSLine : RiArrowRightSLine
  return (
    <Button asChild variant="icon">
      <a
        href={step.href}
        aria-label={`${dirLabel(labels, dir)}: ${step.name}`}
        onClick={(e) => {
          if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return
          e.preventDefault()
          onStep(step)
        }}
      >
        <Arrow size={22} aria-hidden />
      </a>
    </Button>
  )
}

function ModalEnd({ dir, labels }: { dir: Dir; labels: StepperLabels }) {
  const Arrow = dir === 'prev' ? RiArrowLeftSLine : RiArrowRightSLine
  return (
    <Button variant="icon" disabled aria-label={dirLabel(labels, dir)}>
      <Arrow size={22} aria-hidden />
    </Button>
  )
}

// `<a>`, not `<Link>`: the `@modal` slot intercepts soft navigations to an event
// URL from anywhere under `/editions/[year]`, including from this page, which
// would stack the next event's modal over the page being read.
function RailStep({ step, dir, labels }: { step: EventStep; dir: Dir; labels: StepperLabels }) {
  const Arrow = dir === 'prev' ? RiArrowLeftLine : RiArrowRightLine
  return (
    <a className={rail.step} href={step.href} data-dir={dir}>
      <Text as="span" variant="label" className={rail.stepLabel}>
        {dir === 'prev' && <Arrow size={14} aria-hidden />}
        {dirLabel(labels, dir)}
        {dir === 'next' && <Arrow size={14} aria-hidden />}
      </Text>
      <Text as="span" variant="body" className={rail.stepName} data-step-name>
        {step.name}
      </Text>
    </a>
  )
}

export function ModalStepper({
  steps,
  onStep,
  labels,
}: {
  steps: EventSteps
  onStep: (step: EventStep) => void
  labels: StepperLabels
}) {
  const { prev, next, index, total } = steps
  if (index === undefined || total === undefined) return null

  return (
    <div className={modal.root}>
      {prev ? (
        <ModalStep step={prev} dir="prev" onStep={onStep} labels={labels} />
      ) : (
        <ModalEnd dir="prev" labels={labels} />
      )}
      <StepCount className={modal.count} index={index} total={total} labels={labels} />
      {next ? (
        <ModalStep step={next} dir="next" onStep={onStep} labels={labels} />
      ) : (
        <ModalEnd dir="next" labels={labels} />
      )}
    </div>
  )
}

export function RailStepper({ steps, labels }: { steps: EventSteps; labels: StepperLabels }) {
  const { prev, next, index, total } = steps
  if (index === undefined || total === undefined) return null

  return (
    <nav className={rail.root} aria-label={labels.stepperNav}>
      {prev ? <RailStep step={prev} dir="prev" labels={labels} /> : <span className={rail.end} />}
      <StepCount className={rail.count} index={index} total={total} labels={labels} />
      {next ? <RailStep step={next} dir="next" labels={labels} /> : <span className={rail.end} />}
    </nav>
  )
}
