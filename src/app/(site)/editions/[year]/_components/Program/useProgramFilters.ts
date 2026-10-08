'use client'

import {
  DEFAULT_FILTERS,
  filterUrl,
  type ProgramFilterOptions,
  type ProgramFilters,
  parseFilters,
  toggleSelection,
} from '@program/program-filters'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

export interface UseProgramFilters {
  filters: ProgramFilters
  toggleVenue: (slug: string) => void
  toggleType: (slug: string) => void
  setShowPast: (value: boolean) => void
  reset: () => void
}

export function useProgramFilters(filterOptions: ProgramFilterOptions): UseProgramFilters {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()

  const search = searchParams.toString()
  const filters = parseFilters(search)

  const venueSlugs = filterOptions.venues.map((o) => o.slug)
  const typeSlugs = filterOptions.types.map((o) => o.slug)

  const commit = (next: ProgramFilters) =>
    router.replace(filterUrl(pathname, search, next), { scroll: false })

  const toggleVenue = (slug: string) =>
    commit({ ...filters, venues: toggleSelection(filters.venues, slug, venueSlugs) })
  const toggleType = (slug: string) =>
    commit({ ...filters, types: toggleSelection(filters.types, slug, typeSlugs) })
  const setShowPast = (value: boolean) => commit({ ...filters, showPast: value })
  const reset = () => commit(DEFAULT_FILTERS)

  return { filters, toggleVenue, toggleType, setShowPast, reset }
}
