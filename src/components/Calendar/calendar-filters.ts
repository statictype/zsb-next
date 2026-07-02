// Pure filter logic for the calendar (ZSB-29): the filter model, computing
// available options from events, and applying the active selection. URL
// codec lives in `./url`; per-filter selection algebra lives in
// `./filter-selection`. No React / DOM / `server-only` dependency so this
// stays trivially unit-testable; the `useCalendarFilters` hook wraps it with
// the client-side URL store. Filtering and the past/upcoming split run in the
// browser — the edition page is cached, so "what's past" is judged against
// the visitor's own clock, never at build time.

import { isPastEvent } from '@/lib/edition-dates'
import type { CalendarEvent } from '@/types/edition'
import type { FilterSelection } from './filter-selection'

export interface CalendarFilters {
  venues: FilterSelection
  types: FilterSelection
  /**
   * Explicit show-past choice, or `null` to follow the edition default
   * (hide past on a live edition, show it on a finished one). Tri-state so a
   * shared link can pin the choice and survive a refresh.
   */
  showPast: boolean | null
}

export const DEFAULT_FILTERS: CalendarFilters = { venues: null, types: null, showPast: null }

export interface FilterOption {
  slug: string
  label: string
  count: number
}

export interface CalendarFilterOptions {
  venues: FilterOption[]
  types: FilterOption[]
}

// The venue a filter chip represents is each event's stamped `rollUp`: a space
// inside a bigger place rolls up to its parent, so every studio and gallery
// within CFP — UNAgaleria, the artists' studios — filters under the single
// "CFP" chip instead of cluttering the bar. The rollup is computed once in the
// data layer (ZSB-65), so the chips here and the Visit venues view share one
// key; events still render their specific venue in the agenda.

// ---- Past / show-past default ----
// Past-ness itself (`isPastEvent`) lives in `@/lib/edition-dates` with the
// rest of the event-time judgement (ZSB-59); these resolve the `showPast`
// filter field's own default.

export function hasUpcomingEvents(events: CalendarEvent[], todayIso: string): boolean {
  return events.some((e) => !isPastEvent(e, todayIso))
}

export function hasPastEvents(events: CalendarEvent[], todayIso: string): boolean {
  return events.some((e) => isPastEvent(e, todayIso))
}

// Whether past events should be shown, given the explicit choice (if any) and
// the edition shape. Default: hide on a live edition (it has upcoming events),
// show on a finished one (nothing upcoming — otherwise the calendar is empty).
// `todayIso` is `null` before the client clock resolves; until then we don't
// judge time, so nothing is hidden (the prerendered shell shows every event).
export function resolveShowPast(
  filters: CalendarFilters,
  events: CalendarEvent[],
  todayIso: string | null,
): boolean {
  if (todayIso === null) return true
  if (filters.showPast !== null) return filters.showPast
  return !hasUpcomingEvents(events, todayIso)
}

// Build the venue + type filter option lists from every event (not the
// filtered set), each ordered by event count then label so the busiest
// places lead and the order is stable across renders.
export function computeFilterOptions(events: CalendarEvent[]): CalendarFilterOptions {
  const venues = new Map<string, FilterOption>()
  const types = new Map<string, FilterOption>()
  for (const e of events) {
    const v = e.venue.rollUp
    const existing = venues.get(v.slug)
    if (existing) existing.count++
    else venues.set(v.slug, { slug: v.slug, label: v.name, count: 1 })
    for (const t of e.types) {
      const et = types.get(t.slug)
      if (et) et.count++
      else types.set(t.slug, { slug: t.slug, label: t.title, count: 1 })
    }
  }
  const byCountThenLabel = (a: FilterOption, b: FilterOption) =>
    b.count - a.count || a.label.localeCompare(b.label)
  return {
    venues: [...venues.values()].sort(byCountThenLabel),
    types: [...types.values()].sort(byCountThenLabel),
  }
}

// Whether an event passes the venue/type filter selection — the
// time-independent half of the filter. A `null` selection imposes no
// constraint (everything selected); otherwise the event must match a
// selected venue / one of its types must be selected (so an empty selection
// matches nothing). Drives both the headline "X of Y upcoming" count
// (ZSB-47) and `applyFilters`.
export function matchesFilters(event: CalendarEvent, filters: CalendarFilters): boolean {
  const { venues, types } = filters
  if (venues !== null && !venues.includes(event.venue.rollUp.slug)) return false
  if (types !== null && !event.types.some((t) => types.includes(t.slug))) return false
  return true
}

// Narrow events to the active selection: the filter match above, then the
// past/upcoming split — past events drop out unless show-past resolves on.
export function applyFilters(
  events: CalendarEvent[],
  filters: CalendarFilters,
  todayIso: string | null,
): CalendarEvent[] {
  const showPast = resolveShowPast(filters, events, todayIso)
  return events.filter((e) => {
    if (!matchesFilters(e, filters)) return false
    if (!showPast && todayIso !== null && isPastEvent(e, todayIso)) return false
    return true
  })
}

// Whether the filters deviate from the default (all selected, past at default).
export function hasActiveFilters(filters: CalendarFilters): boolean {
  return filters.venues !== null || filters.types !== null || filters.showPast !== null
}
