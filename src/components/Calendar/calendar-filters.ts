// Pure filter logic for the calendar (ZSB-29). No React / DOM / `server-only`
// dependency so it stays trivially unit-testable; the `useCalendarFilters`
// hook wraps it with the client-side URL store. Filtering and the past/upcoming
// split run in the browser — the edition page is cached, so "what's past" is
// judged against the visitor's own clock, never at build time.

import { eventEndIso, isPastEvent } from '@/lib/edition-dates'
import type { CalendarEvent } from '@/types/edition'

// URL param names — short so shared links (ZSB-33) stay compact. The open event
// is a route now (`events/[key]`, ADR 0015), not a query param.
const PARAM_VENUE = 'venue'
const PARAM_TYPE = 'type'
const PARAM_PAST = 'past'

// A facet selection. The chips read as a multi-select that's all-on by default,
// so the states are:
//   null      → every option selected (the default; serialized as no param so
//               the URL stays clean and is robust to the option list changing)
//   string[]  → exactly these slugs selected (an empty array means none — the
//               calendar shows nothing for that facet)
export type FacetSelection = string[] | null

export interface CalendarFilters {
  venues: FacetSelection
  types: FacetSelection
  /**
   * Explicit show-past choice, or `null` to follow the edition default
   * (hide past on a live edition, show it on a finished one). Tri-state so a
   * shared link can pin the choice and survive a refresh.
   */
  showPast: boolean | null
}

export const DEFAULT_FILTERS: CalendarFilters = { venues: null, types: null, showPast: null }

export interface FacetOption {
  slug: string
  label: string
  count: number
}

export interface CalendarFacets {
  venues: FacetOption[]
  types: FacetOption[]
}

// The venue a filter chip represents is each event's stamped `rollUp`: a space
// inside a bigger place rolls up to its parent, so every studio and gallery
// within CFP — UNAgaleria, the artists' studios — filters under the single
// "CFP" chip instead of cluttering the bar. The rollup is computed once in the
// data layer (ZSB-65), so the chips here and the Visit venues view share one
// key; events still render their specific venue in the agenda.

// ---- Facet selection helpers ----

export function isSelected(selection: FacetSelection, slug: string): boolean {
  return selection === null || selection.includes(slug)
}

export function isAllSelected(selection: FacetSelection): boolean {
  return selection === null
}

export function isNoneSelected(selection: FacetSelection): boolean {
  return selection !== null && selection.length === 0
}

// Toggle one option, given every available slug in canonical order. Collapses
// to `null` once everything ends up selected, so the default state always
// serializes to a clean URL. The result keeps the canonical order and drops any
// stale slugs no longer in the facet.
export function toggleSelection(
  selection: FacetSelection,
  slug: string,
  allSlugs: string[],
): FacetSelection {
  const set = new Set(selection === null ? allSlugs : selection)
  if (set.has(slug)) set.delete(slug)
  else set.add(slug)
  const next = allSlugs.filter((s) => set.has(s))
  return next.length === allSlugs.length ? null : next
}

// ---- Past / window logic ----
// Past-ness itself (`isPastEvent` / `eventEndIso`) lives in
// `@/lib/edition-dates` with the rest of the event-time judgement (ZSB-59);
// these helpers apply it to the calendar's filter state.

export function hasUpcomingEvents(events: CalendarEvent[], todayIso: string): boolean {
  return events.some((e) => !isPastEvent(e, todayIso))
}

export function hasPastEvents(events: CalendarEvent[], todayIso: string): boolean {
  return events.some((e) => isPastEvent(e, todayIso))
}

// The full edition window [earliest start, latest end] across every event.
// Judged on the whole edition (never the filtered subset) so live/ended status
// stays stable as filters change.
export function editionWindow(events: CalendarEvent[]): [string | null, string | null] {
  let start: string | null = null
  let end: string | null = null
  for (const e of events) {
    if (start === null || e.startDate < start) start = e.startDate
    const eEnd = eventEndIso(e)
    if (end === null || eEnd > end) end = eEnd
  }
  return [start, end]
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

// Build the venue + type facet lists from every event (not the filtered set),
// each ordered by event count then label so the busiest places lead and the
// order is stable across renders.
export function computeFacets(events: CalendarEvent[]): CalendarFacets {
  const venues = new Map<string, FacetOption>()
  const types = new Map<string, FacetOption>()
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
  const byCountThenLabel = (a: FacetOption, b: FacetOption) =>
    b.count - a.count || a.label.localeCompare(b.label)
  return {
    venues: [...venues.values()].sort(byCountThenLabel),
    types: [...types.values()].sort(byCountThenLabel),
  }
}

// Whether an event passes the venue/type facet selection — the time-independent
// half of the filter. A `null` facet imposes no constraint (everything
// selected); otherwise the event must match a selected venue / one of its types
// must be selected (so an empty selection matches nothing). Drives both the
// headline "X of Y upcoming" count (ZSB-47) and `applyFilters`.
export function matchesFacets(event: CalendarEvent, filters: CalendarFilters): boolean {
  const { venues, types } = filters
  if (venues !== null && !venues.includes(event.venue.rollUp.slug)) return false
  if (types !== null && !event.types.some((t) => types.includes(t.slug))) return false
  return true
}

// Narrow events to the active selection: the facet match above, then the
// past/upcoming split — past events drop out unless show-past resolves on.
export function applyFilters(
  events: CalendarEvent[],
  filters: CalendarFilters,
  todayIso: string | null,
): CalendarEvent[] {
  const showPast = resolveShowPast(filters, events, todayIso)
  return events.filter((e) => {
    if (!matchesFacets(e, filters)) return false
    if (!showPast && todayIso !== null && isPastEvent(e, todayIso)) return false
    return true
  })
}

// Whether the filters deviate from the default (all selected, past at default).
export function hasActiveFilters(filters: CalendarFilters): boolean {
  return filters.venues !== null || filters.types !== null || filters.showPast !== null
}

function parseList(value: string | null): string[] {
  if (!value) return []
  return value
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
}

// Read filters out of a URL query string (`location.search`, leading `?` ok).
// A present param (even empty) is an explicit selection; an absent one is the
// all-selected default (`null`).
export function parseFilters(search: string): CalendarFilters {
  const params = new URLSearchParams(search)
  const past = params.get(PARAM_PAST)
  return {
    venues: params.has(PARAM_VENUE) ? parseList(params.get(PARAM_VENUE)) : null,
    types: params.has(PARAM_TYPE) ? parseList(params.get(PARAM_TYPE)) : null,
    showPast: past === null ? null : past === '1',
  }
}

function setSelection(params: URLSearchParams, key: string, selection: FacetSelection): void {
  // null (all selected) → omit the param entirely; otherwise list the slugs
  // (an empty selection becomes `key=`, which round-trips back to []).
  if (selection === null) params.delete(key)
  else params.set(key, selection.join(','))
}

// Serialize filters back to a query string (no leading `?`, `""` at the
// default). `base` preserves any unrelated params already on the URL.
export function serializeFilters(filters: CalendarFilters, base = ''): string {
  const params = new URLSearchParams(base)
  setSelection(params, PARAM_VENUE, filters.venues)
  setSelection(params, PARAM_TYPE, filters.types)
  if (filters.showPast === null) params.delete(PARAM_PAST)
  else params.set(PARAM_PAST, filters.showPast ? '1' : '0')
  return params.toString()
}
