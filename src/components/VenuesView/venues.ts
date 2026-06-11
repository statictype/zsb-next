import { eventWhenLabelShort } from '@/lib/edition-dates'
import type { CalendarEvent, EventTypeTag } from '@/types/edition'

// Turns the current edition's flat event list into the venues view's shape:
// top-level venues grouped by type, with sub-venues (a studio inside CFP)
// rolled up under their parent. One level of nesting only — a venue named as
// someone's parent is always rendered top-level, ignoring its own `partOf`
// (matches the data and ZSB-32's "studios under CFP"). Pure, so it's cheap to
// test and the component stays a thin renderer.

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
  childType: string | null
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
  // Names that are someone's parent — those venues are always top-level.
  const parentNames = new Set(events.flatMap((e) => (e.venue.partOf ? [e.venue.partOf.name] : [])))
  const nodes = new Map<string, Builder>()

  const ensure = (name: string, type: string): Builder => {
    let node = nodes.get(name)
    if (!node) {
      node = {
        name,
        type,
        address: undefined,
        mapUrl: undefined,
        parent: null,
        childType: null,
        events: [],
      }
      nodes.set(name, node)
    } else if (!node.type) {
      node.type = type
    }
    return node
  }

  for (const e of events) {
    const v = e.venue
    const node = ensure(v.name, v.type)
    // A venue's own facts win over a parent-stub that may have been created first.
    node.address = v.address ?? node.address
    node.mapUrl = v.mapUrl ?? node.mapUrl
    if (v.partOf && !parentNames.has(v.name)) {
      node.parent = v.partOf.name
      node.childType = v.type
    }
    node.events.push(e)
    if (v.partOf) ensure(v.partOf.name, v.partOf.type)
  }

  const childrenByParent = new Map<string, VenueNode[]>()
  const tops: Builder[] = []
  for (const node of nodes.values()) {
    if (node.parent === null) {
      tops.push(node)
    } else {
      const child: VenueNode = {
        name: node.name,
        type: node.childType ?? node.type,
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
