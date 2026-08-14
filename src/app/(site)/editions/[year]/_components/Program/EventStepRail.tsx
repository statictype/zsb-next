import { eventView } from '@program/EventView.recipe'
import type { EventStep, EventSteps } from '@program/event-steps'
import { RiArrowLeftLine, RiArrowRightLine } from '@remixicon/react'
import { Text } from 'styled-system/jsx'

const s = eventView()

// `<a>`, not `<Link>`: the `@modal` slot intercepts soft navigations to an event
// URL from anywhere under `/editions/[year]`, including from this page, which
// would stack the next event's modal over the page being read.
function Step({ step, dir }: { step: EventStep; dir: 'prev' | 'next' }) {
  const Arrow = dir === 'prev' ? RiArrowLeftLine : RiArrowRightLine
  return (
    <a className={s.step} href={step.href} data-dir={dir}>
      <Text as="span" variant="label" className={s.stepLabel}>
        {dir === 'prev' && <Arrow size={14} aria-hidden />}
        {dir === 'prev' ? 'Previous event' : 'Next event'}
        {dir === 'next' && <Arrow size={14} aria-hidden />}
      </Text>
      <Text as="span" variant="body" className={s.stepName} data-step-name>
        {step.name}
      </Text>
    </a>
  )
}

export function EventStepRail({ prev, next, index, total }: EventSteps) {
  if (index === undefined || total === undefined) return null

  return (
    <nav className={s.rail} aria-label="Previous and next events">
      {prev ? <Step step={prev} dir="prev" /> : <span className={s.end} />}
      <Text as="span" variant="caption" className={s.count}>
        {index + 1} of {total}
      </Text>
      {next ? <Step step={next} dir="next" /> : <span className={s.end} />}
    </nav>
  )
}
