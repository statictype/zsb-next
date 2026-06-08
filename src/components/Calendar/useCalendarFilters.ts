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
import { getSearchSnapshot, getServerSnapshot, subscribeUrl, writeUrl } from './calendar-url'

// Filter state lives entirely in the URL, read and written on the client only.
// See `calendar-url.ts` for why (cached page, no `useSearchParams`). Sharing
// (ZSB-33) just reads the URL; the event modal (ZSB-40) shares the same store.

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
  const search = useSyncExternalStore(subscribeUrl, getSearchSnapshot, getServerSnapshot)
  const ready = search !== null
  const filters = useMemo(
    () => (search === null ? DEFAULT_FILTERS : parseFilters(search)),
    [search],
  )

  const venueSlugs = useMemo(() => facets.venues.map((o) => o.slug), [facets])
  const typeSlugs = useMemo(() => facets.types.map((o) => o.slug), [facets])

  // Write the next filter state to the URL (replacing, preserving unrelated
  // params like the open event), then the store re-reads.
  const commit = useCallback((next: CalendarFilters) => {
    writeUrl(serializeFilters(next, window.location.search))
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
