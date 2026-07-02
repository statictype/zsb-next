'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import {
  type CalendarFilterOptions,
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

export function useCalendarFilters(filterOptions: CalendarFilterOptions): UseCalendarFilters {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()

  const search = searchParams.toString()
  const filters = parseFilters(search)

  const venueSlugs = filterOptions.venues.map((o) => o.slug)
  const typeSlugs = filterOptions.types.map((o) => o.slug)

  // Write the next filter state to the URL (replacing, no scroll jump),
  // preserving any unrelated params; `useSearchParams` re-reads once it lands.
  const commit = (next: CalendarFilters) => {
    const query = serializeFilters(next, search)
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false })
  }

  const toggleVenue = (slug: string) =>
    commit({ ...filters, venues: toggleSelection(filters.venues, slug, venueSlugs) })
  const toggleType = (slug: string) =>
    commit({ ...filters, types: toggleSelection(filters.types, slug, typeSlugs) })
  const setShowPast = (value: boolean) => commit({ ...filters, showPast: value })
  const reset = () => commit(DEFAULT_FILTERS)

  return { filters, toggleVenue, toggleType, setShowPast, reset }
}
