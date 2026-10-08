// Keep free of React, DOM and `server-only` imports: unit-tested directly.
// Filtering runs in the browser because the edition page is cached.

import { PROGRAM_LABELS } from '@program/program-labels'
import {
  type DayToken,
  dayToken,
  editionWindow,
  eventEndIso,
  formatShortRange,
  isMultiDayRun,
  isPastEvent,
} from '@/lib/edition-dates'
import type { CalendarEvent, Lang } from '@/types/edition'

// `null` means every option is selected and serializes to no URL param; `[]`
// means none.
export type FilterSelection = string[] | null

export function isSelected(selection: FilterSelection, slug: string): boolean {
  return selection === null || selection.includes(slug)
}

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

export interface ProgramFilters {
  venues: FilterSelection
  types: FilterSelection
  showPast: boolean | null
}

export const DEFAULT_FILTERS: ProgramFilters = { venues: null, types: null, showPast: null }

export interface FilterOption {
  slug: string
  label: string
  count: number
}

export interface ProgramFilterOptions {
  venues: FilterOption[]
  types: FilterOption[]
}

// Chips key on `venue.rollUp`, the same field the JSON-LD Places use.

function hasUpcomingEvents(events: CalendarEvent[], todayIso: string): boolean {
  return events.some((e) => !isPastEvent(e, todayIso))
}

function hasPastEvents(events: CalendarEvent[], todayIso: string): boolean {
  return events.some((e) => isPastEvent(e, todayIso))
}

function resolveShowPast(
  filters: ProgramFilters,
  events: CalendarEvent[],
  todayIso: string | null,
): boolean {
  if (todayIso === null) return true
  if (filters.showPast !== null) return filters.showPast
  return !hasUpcomingEvents(events, todayIso)
}

export function computeFilterOptions(events: CalendarEvent[]): ProgramFilterOptions {
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

function matchesFilters(event: CalendarEvent, filters: ProgramFilters): boolean {
  const { venues, types } = filters
  if (venues !== null && !venues.includes(event.venue.rollUp.slug)) return false
  if (types !== null && !event.types.some((t) => types.includes(t.slug))) return false
  return true
}

function applyFilters(
  events: CalendarEvent[],
  filters: ProgramFilters,
  todayIso: string | null,
): CalendarEvent[] {
  const showPast = resolveShowPast(filters, events, todayIso)
  return events.filter((e) => {
    if (!matchesFilters(e, filters)) return false
    if (!showPast && todayIso !== null && isPastEvent(e, todayIso)) return false
    return true
  })
}

function hasActiveFilters(filters: ProgramFilters): boolean {
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

// A present param, even empty, is an explicit selection.
export function parseFilters(search: string): ProgramFilters {
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

function serializeFilters(filters: ProgramFilters, base = ''): string {
  const params = new URLSearchParams(base)
  setSelection(params, PARAM_VENUE, filters.venues)
  setSelection(params, PARAM_TYPE, filters.types)
  if (filters.showPast === null) params.delete(PARAM_PAST)
  else params.set(PARAM_PAST, filters.showPast ? '1' : '0')
  return params.toString()
}

export function filterUrl(pathname: string, search: string, next: ProgramFilters): string {
  const query = serializeFilters(next, search)
  return query ? `${pathname}?${query}` : pathname
}

export interface ProgramDay {
  iso: string
  token: DayToken
  events: CalendarEvent[]
  past: boolean
  today: boolean
}

export interface ProgramRun {
  event: CalendarEvent
  past: boolean
  range: string
}

interface Schedule {
  ongoing: ProgramRun[]
  days: ProgramDay[]
}

export interface ProgramView extends Schedule {
  visible: CalendarEvent[]
  upcoming: number
  upcomingMatching: number
  past: number
  showPast: boolean
  showPastControl: boolean
  canReset: boolean
  ended: boolean
  countLabel: string
}

// Untimed events sort first: '' < '18:00'.
function byTimeThenName(a: CalendarEvent, b: CalendarEvent): number {
  return (a.startTime ?? '').localeCompare(b.startTime ?? '') || a.name.localeCompare(b.name)
}

function buildSchedule(events: CalendarEvent[], clock: string | null, lang: Lang): Schedule {
  const runs: CalendarEvent[] = []
  const byDay = new Map<string, CalendarEvent[]>()

  for (const event of events) {
    if (isMultiDayRun(event.startDate, event.endDate)) {
      runs.push(event)
    } else {
      const bucket = byDay.get(event.startDate)
      if (bucket) bucket.push(event)
      else byDay.set(event.startDate, [event])
    }
  }

  runs.sort(
    (a, b) =>
      a.startDate.localeCompare(b.startDate) ||
      (a.endDate ?? '').localeCompare(b.endDate ?? '') ||
      a.name.localeCompare(b.name),
  )
  const ongoing: ProgramRun[] = runs.map((event) => ({
    event,
    past: clock !== null && isPastEvent(event, clock),
    range: formatShortRange(event.startDate, eventEndIso(event), lang) ?? '',
  }))

  const days: ProgramDay[] = [...byDay.keys()]
    .sort((a, b) => a.localeCompare(b))
    .map((iso) => ({
      iso,
      token: dayToken(iso, lang) ?? {
        weekday: '',
        weekdayLong: '',
        day: 0,
        dayPadded: '',
        month: '',
        monthLong: '',
        year: 0,
      },
      events: (byDay.get(iso) ?? []).sort(byTimeThenName),
      past: clock !== null && iso < clock,
      today: iso === clock,
    }))

  return { ongoing, days }
}

// Unfiltered: filters never reach an event route, so filtered neighbours
// would differ between a soft navigation and a cold load.
export function programOrder(events: CalendarEvent[]): CalendarEvent[] {
  const { ongoing, days } = buildSchedule(events, null, 'en')
  return [...ongoing.map((run) => run.event), ...days.flatMap((day) => day.events)]
}

export function deriveProgramView(
  events: CalendarEvent[],
  filters: ProgramFilters,
  todayIso: string | null,
  lang: Lang = 'en',
): ProgramView {
  const visible = applyFilters(events, filters, todayIso)

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

  // Judged on the whole edition: filtering to past-only on a live edition
  // must not flip the board into archive mode.
  const [, editionEnd] = editionWindow(events)
  const ended = todayIso !== null && editionEnd !== null && todayIso > editionEnd
  const { ongoing, days } = buildSchedule(visible, ended ? null : todayIso, lang)

  const countLabel = PROGRAM_LABELS[lang].count({
    total: events.length,
    upcoming,
    upcomingMatching,
  })

  return {
    visible,
    ongoing,
    days,
    upcoming,
    upcomingMatching,
    past,
    showPast,
    showPastControl,
    canReset,
    ended,
    countLabel,
  }
}
