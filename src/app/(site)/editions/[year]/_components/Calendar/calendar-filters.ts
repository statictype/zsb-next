// Pure filter + derived-view logic for the calendar (ZSB-29): the filter
// model, computing available options from events, applying the active
// selection, and deriving everything the board renders from it (schedule,
// counts, toggle affordances). Also owns the URL codec and the per-filter
// selection algebra — small, single-domain, no reason to split across three
// files. No React / DOM / `server-only` dependency so this stays trivially
// unit-testable; `useCalendarFilters` wraps the codec with the client-side
// URL store. Filtering and the past/upcoming split run in the browser — the
// edition page is cached, so "what's past" is judged against the visitor's
// own clock, never at build time.

import { type DayToken, dayToken, isMultiDayRun, isPastEvent } from '@/lib/edition-dates'
import type { CalendarEvent } from '@/types/edition'

// ---- Per-filter selection algebra ----
// State for one filter dimension (venue, type): a multi-select that's
// all-on by default.
//   null      → every option selected (the default; serialized as no param so
//               the URL stays clean and is robust to the option list changing)
//   string[]  → exactly these slugs selected (an empty array means none — the
//               calendar shows nothing for that filter)
export type FilterSelection = string[] | null

export function isSelected(selection: FilterSelection, slug: string): boolean {
  return selection === null || selection.includes(slug)
}

// Toggle one option, given every available slug in canonical order. Collapses
// to `null` once everything ends up selected, so the default state always
// serializes to a clean URL. The result keeps the canonical order and drops
// any stale slugs no longer in the filter.
export function toggleSelection(
  selection: FilterSelection,
  slug: string,
  allSlugs: string[],
): FilterSelection {
  const set = new Set(selection === null ? allSlugs : selection)
  if (set.has(slug)) set.delete(slug)
  else set.add(slug)
  const next = allSlugs.filter((s) => set.has(s))
  return next.length === allSlugs.length ? null : next
}

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

// ---- URL codec ----
// Param names — short so shared links (ZSB-33) stay compact. The open event
// is a route now (`events/[key]`, ADR 0015), not a query param.
const PARAM_VENUE = 'venue'
const PARAM_TYPE = 'type'
const PARAM_PAST = 'past'

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

function setSelection(params: URLSearchParams, key: string, selection: FilterSelection): void {
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

// ---- Derived view ----
// Everything the board renders, in one call — replaces what used to be 7
// separate call sites (applyFilters, buildSchedule, resolveShowPast,
// hasPastEvents, hasUpcomingEvents, hasActiveFilters, plus a hand-rolled
// counts loop) scattered through Calendar.tsx. Composed from the granular
// functions above (each stays independently tested) rather than re-derived,
// so behaviour is provably unchanged — this is a packaging move, not a
// rewrite of the filtering rules.

export interface AgendaDay {
  iso: string
  token: DayToken
  events: CalendarEvent[]
}

interface Schedule {
  /** Multi-day runs (exhibitions) — shown in the "Ongoing" band, each with its span. */
  onView: CalendarEvent[]
  /** Single-day events, grouped and ordered by date. */
  days: AgendaDay[]
}

export interface CalendarView extends Schedule {
  /** Events passing both the venue/type filter and the past/upcoming split. */
  visible: CalendarEvent[]
  upcoming: number
  upcomingMatching: number
  past: number
  showPast: boolean
  /** Whether the past-events toggle should render at all. */
  showPastControl: boolean
  canReset: boolean
}

// Untimed events sort before timed ones (empty string < "18:00"); ties break
// by name so the order is stable across renders.
function byTimeThenName(a: CalendarEvent, b: CalendarEvent): number {
  return (a.startTime ?? '').localeCompare(b.startTime ?? '') || a.name.localeCompare(b.name)
}

// Split events into the "Ongoing" multi-day runs and the day-by-day agenda.
function buildSchedule(events: CalendarEvent[]): Schedule {
  const onView: CalendarEvent[] = []
  const byDay = new Map<string, CalendarEvent[]>()

  for (const event of events) {
    if (isMultiDayRun(event.startDate, event.endDate)) {
      onView.push(event)
    } else {
      const bucket = byDay.get(event.startDate)
      if (bucket) bucket.push(event)
      else byDay.set(event.startDate, [event])
    }
  }

  onView.sort(
    (a, b) =>
      a.startDate.localeCompare(b.startDate) ||
      (a.endDate ?? '').localeCompare(b.endDate ?? '') ||
      a.name.localeCompare(b.name),
  )

  const days: AgendaDay[] = [...byDay.keys()]
    .sort((a, b) => a.localeCompare(b))
    .map((iso) => ({
      iso,
      token: dayToken(iso) ?? {
        weekday: '',
        weekdayLong: '',
        day: 0,
        dayPadded: '',
        month: '',
        monthLong: '',
        year: 0,
      },
      events: (byDay.get(iso) ?? []).sort(byTimeThenName),
    }))

  return { onView, days }
}

// Headline counts (ZSB-47). Upcoming/past split is judged client-side, so
// before the clock resolves (`todayIso === null`) everything counts as
// "upcoming" and no past affordance shows — matching the all-events shell,
// regardless of the venue/type selection (avoids an "X of Y" flash before we
// even know what's past). `upcomingMatching` reacts to the venue/type
// filters once the clock has resolved; `upcoming`/`past` are whole-edition
// totals, independent of the selection.
export function deriveCalendarView(
  events: CalendarEvent[],
  filters: CalendarFilters,
  todayIso: string | null,
): CalendarView {
  const visible = applyFilters(events, filters, todayIso)
  const { onView, days } = buildSchedule(visible)

  const showPast = resolveShowPast(filters, events, todayIso)
  const showPastControl =
    todayIso !== null && hasPastEvents(events, todayIso) && hasUpcomingEvents(events, todayIso)
  const canReset = hasActiveFilters(filters)

  let upcoming: number
  let upcomingMatching: number
  let past: number
  if (todayIso === null) {
    upcoming = events.length
    upcomingMatching = events.length
    past = 0
  } else {
    upcoming = 0
    upcomingMatching = 0
    past = 0
    for (const e of events) {
      if (isPastEvent(e, todayIso)) past++
      else {
        upcoming++
        if (matchesFilters(e, filters)) upcomingMatching++
      }
    }
  }

  return {
    visible,
    onView,
    days,
    upcoming,
    upcomingMatching,
    past,
    showPast,
    showPastControl,
    canReset,
  }
}
