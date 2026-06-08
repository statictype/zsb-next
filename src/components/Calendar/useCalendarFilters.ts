'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useMemo } from 'react'
import {
  type CalendarFacets,
  type CalendarFilters,
  DEFAULT_FILTERS,
  parseFilters,
  serializeFilters,
  toggleSelection,
} from './calendar-filters'

// Filter state lives in the URL as real search params (ZSB-54): read with
// `useSearchParams`, written with `router.replace`. The calendar renders inside
// a Suspense boundary in the cached edition body, so reading the params on the
// client keeps the edition route partial-prerendered rather than fully dynamic.
// Sharing (ZSB-33) just reads the URL; the event detail is its own route now
// (ADR 0015), not a query param, so nothing here has to preserve it.

export interface UseCalendarFilters {
  filters: CalendarFilters
  toggleVenue: (slug: string) => void
  toggleType: (slug: string) => void
  setShowPast: (value: boolean) => void
  /** Restore the default — every option selected, past at its default. */
  reset: () => void
}

export function useCalendarFilters(facets: CalendarFacets): UseCalendarFilters {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()

  const search = searchParams.toString()
  const filters = useMemo(() => parseFilters(search), [search])

  const venueSlugs = useMemo(() => facets.venues.map((o) => o.slug), [facets])
  const typeSlugs = useMemo(() => facets.types.map((o) => o.slug), [facets])

  // Write the next filter state to the URL (replacing, no scroll jump),
  // preserving any unrelated params; `useSearchParams` re-reads once it lands.
  const commit = useCallback(
    (next: CalendarFilters) => {
      const query = serializeFilters(next, search)
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false })
    },
    [router, pathname, search],
  )

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

  return { filters, toggleVenue, toggleType, setShowPast, reset }
}
