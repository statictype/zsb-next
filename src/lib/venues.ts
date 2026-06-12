import { eventWhenLabelShort } from '@/lib/edition-dates'
import { slugify } from '@/lib/slugify'
import type { CalendarEvent, EventTypeTag } from '@/types/edition'

// The venue rollup (ZSB-65). A venue may sit `partOf` a bigger place (a studio
// inside CFP); the schema allows one level of nesting only. Its *rolled-up
// identity* is the parent when there is one, else the venue itself. This is the
// single rule both venue-facing surfaces group by — the calendar's `venue=`
// filter chips and the Visit venues view — so they can never disagree on "which
// venues exist". It's computed once in the data layer (stamped onto every
// event's venue in `mapEvents`); nothing recomputes it from `partOf`.
//
// `slug` is the calendar filter key, separate from a venue's own URL slug: it's
// `slugify(rolled-up name)`, lossy but matched slug↔slug so it round-trips.
export function rollUpVenue(venue: {
  name: string
  type: string
  partOf?: { name: string; type: string } | null
}): { name: string; slug: string; type: string } {
  const name = venue.partOf?.name ?? venue.name
  const type = venue.partOf?.type ?? venue.type
  return { name, slug: slugify(name), type }
}

// Turns the current edition's flat event list into the venues view's shape:
// top-level venues grouped by type, with sub-venues (a studio inside CFP)
// rolled up under their parent. One level of nesting only — both the parent
// identity and the child/top split key off each venue's stamped `rollUp`
// (matches ZSB-32's "studios under CFP"). Pure, so it's cheap to test and runs
// once in the data layer (`getVisitEdition`); the component stays a thin
// renderer.

export interface VenueEvent {
  key: string
  /** Route slug for the event's own URL (`/editions/<year>/events/<slug>`). */
  slug: string
  name: string
  /** Pre-formatted Bucharest-local date/time, e.g. "Fri 16 May · 18:00". */
  when: string
  types: EventTypeTag[]
}

export interface VenueNode {
  name: string
  type: string
  address?: string
  mapUrl?: string
  events: VenueEvent[]
}

export interface TopVenue extends VenueNode {
  /** Sub-venues rolled up under this one (galleries / studios inside it). */
  children: VenueNode[]
  /** Events here plus everything rolled up under it — drives ordering + the count. */
  totalEvents: number
}

export interface VenueTypeSection {
  type: string
  venues: TopVenue[]
}

interface Builder {
  name: string
  type: string
  address: string | undefined
  mapUrl: string | undefined
  /** Parent venue name, or null for a top-level venue. */
  parent: string | null
  events: CalendarEvent[]
}

function byDateThenName(a: CalendarEvent, b: CalendarEvent): number {
  return (
    a.startDate.localeCompare(b.startDate) ||
    (a.startTime ?? '').localeCompare(b.startTime ?? '') ||
    a.name.localeCompare(b.name)
  )
}

function toVenueEvents(events: CalendarEvent[]): VenueEvent[] {
  return [...events].sort(byDateThenName).map((e) => ({
    key: e.key,
    slug: e.slug,
    name: e.name,
    when: eventWhenLabelShort(e),
    types: e.types,
  }))
}

export function groupVenuesByType(events: CalendarEvent[]): VenueTypeSection[] {
  const nodes = new Map<string, Builder>()

  const ensure = (name: string, type: string): Builder => {
    let node = nodes.get(name)
    if (!node) {
      node = { name, type, address: undefined, mapUrl: undefined, parent: null, events: [] }
      nodes.set(name, node)
    } else if (!node.type) {
      node.type = type
    }
    return node
  }

  for (const e of events) {
    const v = e.venue
    const top = v.rollUp
    // A venue whose rolled-up identity is itself is top-level; otherwise it's a
    // sub-venue and `top` is its parent. Both come from the same stamped field
    // the calendar filters by, so the two surfaces can't disagree.
    const node = ensure(v.name, v.type)
    // A venue's own facts win over a parent-stub that may have been created first.
    node.address = v.address ?? node.address
    node.mapUrl = v.mapUrl ?? node.mapUrl
    node.events.push(e)
    if (top.name !== v.name) {
      node.parent = top.name
      ensure(top.name, top.type)
    }
  }

  const childrenByParent = new Map<string, VenueNode[]>()
  const tops: Builder[] = []
  for (const node of nodes.values()) {
    if (node.parent === null) {
      tops.push(node)
    } else {
      const child: VenueNode = {
        name: node.name,
        type: node.type,
        ...(node.address ? { address: node.address } : {}),
        ...(node.mapUrl ? { mapUrl: node.mapUrl } : {}),
        events: toVenueEvents(node.events),
      }
      const bucket = childrenByParent.get(node.parent)
      if (bucket) bucket.push(child)
      else childrenByParent.set(node.parent, [child])
    }
  }

  const topVenues: TopVenue[] = tops.map((node) => {
    const children = (childrenByParent.get(node.name) ?? []).sort((a, b) =>
      a.name.localeCompare(b.name),
    )
    const childEventCount = children.reduce((sum, c) => sum + c.events.length, 0)
    return {
      name: node.name,
      type: node.type,
      ...(node.address ? { address: node.address } : {}),
      ...(node.mapUrl ? { mapUrl: node.mapUrl } : {}),
      events: toVenueEvents(node.events),
      children,
      totalEvents: node.events.length + childEventCount,
    }
  })

  const byType = new Map<string, TopVenue[]>()
  for (const v of topVenues) {
    const bucket = byType.get(v.type)
    if (bucket) bucket.push(v)
    else byType.set(v.type, [v])
  }

  return [...byType.entries()]
    .map(([type, venues]) => ({
      type,
      venues: venues.sort((a, b) => b.totalEvents - a.totalEvents || a.name.localeCompare(b.name)),
    }))
    .sort((a, b) => {
      const total = (s: VenueTypeSection) => s.venues.reduce((sum, v) => sum + v.totalEvents, 0)
      return total(b) - total(a) || a.type.localeCompare(b.type)
    })
}
