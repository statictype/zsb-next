'use client'

import { useCallback, useMemo, useSyncExternalStore } from 'react'
import {
  type CalendarFacets,
  type CalendarFilters,
  DEFAULT_FILTERS,
  parseFilters,
  serializeFilters,
  toggleSelection,
} from './calendar-filters'

// Filter state lives entirely in the URL, read and written on the client only —
// the edition page is cached (`'use cache'`), so we must never touch
// `searchParams` on the server (that would de-opt the static shell) and we
// avoid `useSearchParams`, which forces a CSR bailout on a prerendered route.
// Instead this mirrors the Calendar's `useTodayIso`: a `useSyncExternalStore`
// whose server snapshot is `null`, so the prerendered HTML renders every event
// and the client narrows it once hydrated. Sharing (ZSB-33) just reads the URL.

// `replaceState` doesn't fire `popstate`, so we emit our own event to notify
// the store after a programmatic URL change.
const URL_EVENT = 'zsb:calendar-url'

function subscribe(onChange: () => void): () => void {
  window.addEventListener('popstate', onChange)
  window.addEventListener(URL_EVENT, onChange)
  return () => {
    window.removeEventListener('popstate', onChange)
    window.removeEventListener(URL_EVENT, onChange)
  }
}

const getSearchSnapshot = (): string => window.location.search
const getServerSnapshot = (): null => null

export interface UseCalendarFilters {
  filters: CalendarFilters
  /** True once the client URL is known (false on the server / during hydration). */
  ready: boolean
  toggleVenue: (slug: string) => void
  toggleType: (slug: string) => void
  setShowPast: (value: boolean) => void
  /** Restore the default — every option selected, past at its default. */
  reset: () => void
}

export function useCalendarFilters(facets: CalendarFacets): UseCalendarFilters {
  const search = useSyncExternalStore(subscribe, getSearchSnapshot, getServerSnapshot)
  const ready = search !== null
  const filters = useMemo(
    () => (search === null ? DEFAULT_FILTERS : parseFilters(search)),
    [search],
  )

  const venueSlugs = useMemo(() => facets.venues.map((o) => o.slug), [facets])
  const typeSlugs = useMemo(() => facets.types.map((o) => o.slug), [facets])

  // Write the next filter state to the URL without a navigation or scroll jump,
  // preserving any unrelated params, then nudge the store to re-read.
  const commit = useCallback((next: CalendarFilters) => {
    const query = serializeFilters(next, window.location.search)
    const url = `${window.location.pathname}${query ? `?${query}` : ''}${window.location.hash}`
    window.history.replaceState(window.history.state, '', url)
    window.dispatchEvent(new Event(URL_EVENT))
  }, [])

  const toggleVenue = useCallback(
    (slug: string) =>
      commit({ ...filters, venues: toggleSelection(filters.venues, slug, venueSlugs) }),
    [commit, filters, venueSlugs],
  )
  const toggleType = useCallback(
    (slug: string) =>
      commit({ ...filters, types: toggleSelection(filters.types, slug, typeSlugs) }),
    [commit, filters, typeSlugs],
  )
  const setShowPast = useCallback(
    (value: boolean) => commit({ ...filters, showPast: value }),
    [commit, filters],
  )
  const reset = useCallback(() => commit(DEFAULT_FILTERS), [commit])

  return { filters, ready, toggleVenue, toggleType, setShowPast, reset }
}
