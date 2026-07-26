// Keep this free of React / DOM / `server-only` imports: it is unit-tested
// directly. Filtering and the past/upcoming split run in the browser because
// the edition page is cached — "what's past" is the visitor's clock, not the
// build's.

import {
  type DayToken,
  dayToken,
  editionWindow,
  formatShortRange,
  isMultiDayRun,
  isPastEvent,
} from '@/lib/edition-dates'
import type { CalendarEvent } from '@/types/edition'

// `null` means every option is selected, and serializes to no URL param at all
// — which is also what makes a shared link survive the option list changing.
// `[]` means none.
export type FilterSelection = string[] | null

export function isSelected(selection: FilterSelection, slug: string): boolean {
  return selection === null || selection.includes(slug)
}

// `allSlugs` is the canonical order; the result is filtered through it, which
// also drops slugs no longer in the edition.
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
  /** Tri-state: `null` follows the edition default, so a shared link can pin
   *  an explicit choice without freezing the default for everyone else. */
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

// Chips key on `venue.rollUp`, stamped in the data layer, so a studio inside
// CFP filters under CFP — and so these chips and the Visit venues view can't
// disagree about which venues exist.

export function hasUpcomingEvents(events: CalendarEvent[], todayIso: string): boolean {
  return events.some((e) => !isPastEvent(e, todayIso))
}

export function hasPastEvents(events: CalendarEvent[], todayIso: string): boolean {
  return events.some((e) => isPastEvent(e, todayIso))
}

// Defaults to hiding past events, except on a finished edition, where that
// would leave the calendar empty. `todayIso === null` is the null-clock
// convention (`lib/today.ts`): before the clock resolves, hide nothing.
export function resolveShowPast(
  filters: CalendarFilters,
  events: CalendarEvent[],
  todayIso: string | null,
): boolean {
  if (todayIso === null) return true
  if (filters.showPast !== null) return filters.showPast
  return !hasUpcomingEvents(events, todayIso)
}

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

// The time-independent half of the filter, shared by `applyFilters` and the
// headline count.
export function matchesFilters(event: CalendarEvent, filters: CalendarFilters): boolean {
  const { venues, types } = filters
  if (venues !== null && !venues.includes(event.venue.rollUp.slug)) return false
  if (types !== null && !event.types.some((t) => types.includes(t.slug))) return false
  return true
}

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

export function hasActiveFilters(filters: CalendarFilters): boolean {
  return filters.venues !== null || filters.types !== null || filters.showPast !== null
}

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

// A present param, even empty, is an explicit selection; an absent one is the
// all-selected default.
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
  if (selection === null) params.delete(key)
  else params.set(key, selection.join(','))
}

// `base` preserves unrelated params already on the URL.
export function serializeFilters(filters: CalendarFilters, base = ''): string {
  const params = new URLSearchParams(base)
  setSelection(params, PARAM_VENUE, filters.venues)
  setSelection(params, PARAM_TYPE, filters.types)
  if (filters.showPast === null) params.delete(PARAM_PAST)
  else params.set(PARAM_PAST, filters.showPast ? '1' : '0')
  return params.toString()
}

// Collapses to the bare pathname at the default, so the clean URL is canonical.
export function filterUrl(pathname: string, search: string, next: CalendarFilters): string {
  const query = serializeFilters(next, search)
  return query ? `${pathname}?${query}` : pathname
}

export interface AgendaDay {
  iso: string
  token: DayToken
  events: CalendarEvent[]
}

interface Schedule {
  onView: CalendarEvent[]
  days: AgendaDay[]
}

export interface CalendarView extends Schedule {
  visible: CalendarEvent[]
  upcoming: number
  /** `upcoming` narrowed by the venue/type selection. */
  upcomingMatching: number
  past: number
  showPast: boolean
  showPastControl: boolean
  canReset: boolean
  ended: boolean
  /** Non-null exactly while the edition is live, so the board's past-greying
   *  narrows instead of asserting on `todayIso`. */
  liveClock: string | null
  windowLabel: string
  countLabel: string
}

// Untimed events sort first: '' < '18:00'.
function byTimeThenName(a: CalendarEvent, b: CalendarEvent): number {
  return (a.startTime ?? '').localeCompare(b.startTime ?? '') || a.name.localeCompare(b.name)
}

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

// Board reading order, and the sequence the event panel steps through.
// Deliberately unfiltered: filters are client state on the edition URL and
// never reach an event route, so a neighbour derived from them would differ
// between a soft navigation and the same link opened cold.
export function programmeOrder(events: CalendarEvent[]): CalendarEvent[] {
  const { onView, days } = buildSchedule(events)
  return [...onView, ...days.flatMap((day) => day.events)]
}

// Before the clock resolves everything counts as upcoming and no past
// affordance shows, which matches the prerendered shell and avoids an
// "X of Y" flash on hydration.
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

  // Judged on the whole edition, never the filtered subset: filtering to
  // past-only on a live edition must not flip the board into archive mode.
  const [editionStart, editionEnd] = editionWindow(events)
  const ended = todayIso !== null && editionEnd !== null && todayIso > editionEnd
  const liveClock = ended ? null : todayIso
  const windowLabel =
    editionStart && editionEnd ? (formatShortRange(editionStart, editionEnd) ?? '') : ''

  const countLabel =
    upcoming === 0
      ? `${events.length} ${events.length === 1 ? 'event' : 'events'}`
      : upcomingMatching === upcoming
        ? `${upcoming} upcoming ${upcoming === 1 ? 'event' : 'events'}`
        : `${upcomingMatching} of ${upcoming} upcoming events`

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
    ended,
    liveClock,
    windowLabel,
    countLabel,
  }
}
