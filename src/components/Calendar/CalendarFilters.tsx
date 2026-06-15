'use client'

import { RiCheckLine, RiResetLeftLine } from '@remixicon/react'
import { calendarFilters } from './CalendarFilters.recipe'
import {
  type CalendarFacets,
  type FacetOption,
  type FacetSelection,
  type CalendarFilters as Filters,
  isSelected,
} from './calendar-filters'

interface CalendarFiltersProps {
  facets: CalendarFacets
  filters: Filters
  /** True once the filters deviate from the default — enables Reset. */
  canReset: boolean
  onToggleVenue: (slug: string) => void
  onToggleType: (slug: string) => void
  onReset: () => void
}

function FacetChips({
  labelId,
  label,
  options,
  selection,
  onToggle,
}: {
  labelId: string
  label: string
  options: FacetOption[]
  selection: FacetSelection
  onToggle: (slug: string) => void
}) {
  const s = calendarFilters()
  return (
    <div className={s.facet}>
      <span className={s.facetLabel} id={labelId}>
        {label}
      </span>
      <ul className={s.chips} aria-labelledby={labelId}>
        {options.map((option) => {
          const active = isSelected(selection, option.slug)
          return (
            <li key={option.slug}>
              <button
                type="button"
                className={s.chip}
                data-active={active}
                aria-pressed={active}
                onClick={() => onToggle(option.slug)}
              >
                <span className={s.box} aria-hidden>
                  {active && <RiCheckLine size={12} />}
                </span>
                {option.label}
                <span className={s.count}>{option.count}</span>
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export function CalendarFilters({
  facets,
  filters,
  canReset,
  onToggleVenue,
  onToggleType,
  onReset,
}: CalendarFiltersProps) {
  const s = calendarFilters()
  return (
    <div className={s.filters} role="group" aria-label="Filter the programme">
      <div className={s.bar}>
        <button type="button" className={s.reset} onClick={onReset} disabled={!canReset}>
          <RiResetLeftLine size={14} aria-hidden />
          Reset
        </button>
      </div>

      {facets.venues.length > 1 && (
        <FacetChips
          labelId="filter-venue"
          label="Venue"
          options={facets.venues}
          selection={filters.venues}
          onToggle={onToggleVenue}
        />
      )}

      {facets.types.length > 1 && (
        <FacetChips
          labelId="filter-type"
          label="Type"
          options={facets.types}
          selection={filters.types}
          onToggle={onToggleType}
        />
      )}
    </div>
  )
}
