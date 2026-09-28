'use client'

import {
  computeFilterOptions,
  deriveProgramView,
  type ProgramFilterOptions,
  type ProgramFilters,
  type ProgramView,
} from '@program/program-filters'
import { PROGRAM_LABELS, type ProgramLabels } from '@program/program-labels'
import type { ProgramScope } from '@program/program-scope'
import { useProgramFilters } from '@program/useProgramFilters'
import { createContext, type ReactNode, use } from 'react'
import { useTodayIso } from '@/lib/use-today-iso'
import type { CalendarEvent } from '@/types/edition'

export interface ProgramContextValue {
  state: {
    filters: ProgramFilters
    filterOptions: ProgramFilterOptions
    view: ProgramView
    total: number
  }
  actions: {
    toggleVenue: (slug: string) => void
    toggleType: (slug: string) => void
    setShowPast: (value: boolean) => void
    reset: () => void
  }
  meta: { scope: ProgramScope; labels: ProgramLabels }
}

export const ProgramContext = createContext<ProgramContextValue | null>(null)

export function useProgram(): ProgramContextValue {
  const value = use(ProgramContext)
  if (value === null) throw new Error('Program parts must render inside a ProgramProvider')
  return value
}

export function ProgramProvider({
  scope,
  events,
  children,
}: {
  scope: ProgramScope
  events: CalendarEvent[]
  children: ReactNode
}) {
  const todayIso = useTodayIso()
  const filterOptions = computeFilterOptions(events)
  const { filters, toggleVenue, toggleType, setShowPast, reset } = useProgramFilters(filterOptions)
  const view = deriveProgramView(events, filters, todayIso, scope.lang)

  return (
    <ProgramContext
      value={{
        state: { filters, filterOptions, view, total: events.length },
        actions: { toggleVenue, toggleType, setShowPast, reset },
        meta: { scope, labels: PROGRAM_LABELS[scope.lang] },
      }}
    >
      {children}
    </ProgramContext>
  )
}
