import { programOrder } from '@program/program-filters'
import { type ProgramScope, scopeEventHref } from '@program/program-scope'
import type { CalendarEvent } from '@/types/edition'

export interface EventStep {
  slug: string
  href: string
  name: string
}

export interface EventSteps {
  prev?: EventStep | undefined
  next?: EventStep | undefined
  index?: number | undefined
  total?: number | undefined
}

// Shared by the intercepted modal and the cold-load event page.
export function eventSteps(events: CalendarEvent[], slug: string, scope: ProgramScope): EventSteps {
  const order = programOrder(events)
  const at = order.findIndex((event) => event.slug === slug)
  if (at === -1) return {}

  const step = (event: CalendarEvent | undefined): EventStep | undefined =>
    event
      ? { slug: event.slug, href: scopeEventHref(scope, event.slug), name: event.name }
      : undefined

  return { prev: step(order[at - 1]), next: step(order[at + 1]), index: at, total: order.length }
}
