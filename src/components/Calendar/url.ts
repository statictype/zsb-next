import type { CalendarFilters } from './calendar-filters'
import type { FilterSelection } from './filter-selection'

// URL param names — short so shared links (ZSB-33) stay compact. The open event
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
