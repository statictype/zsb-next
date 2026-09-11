import { programOrder } from '@program/program-filters'
import { eventHref } from '@/lib/edition-href'
import type { CalendarEvent } from '@/types/edition'

/** One neighbour of the open event: where it lives and what to call it. */
export interface EventStep {
  href: string
  name: string
}

export interface EventSteps {
  prev?: EventStep | undefined
  next?: EventStep | undefined
  /** This event's 0-based position in the program, alongside `total`. */
  index?: number | undefined
  total?: number | undefined
}

// The event panel's neighbours in the program. Both event routes — the
// intercepted modal and the cold-load page — derive them here so a shared link
// steps through the same sequence a soft navigation does. The ends don't wrap:
// the program has a first and a last event, and a panel that loops hides that.
export function eventSteps(events: CalendarEvent[], slug: string, year: number): EventSteps {
  const order = programOrder(events)
  const at = order.findIndex((event) => event.slug === slug)
  if (at === -1) return {}

  const step = (event: CalendarEvent | undefined): EventStep | undefined =>
    event ? { href: eventHref(year, event.slug), name: event.name } : undefined

  return { prev: step(order[at - 1]), next: step(order[at + 1]), index: at, total: order.length }
}
