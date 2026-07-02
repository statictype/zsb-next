'use client'

import { RiResetLeftLine } from '@remixicon/react'
import { Button } from '@/components/ui/Button/Button'
import { Checkbox } from '@/components/ui/Checkbox/Checkbox'
import { calendarFilters } from './CalendarFilters.recipe'
import {
  type CalendarFilterOptions,
  type FilterOption,
  type CalendarFilters as Filters,
} from './calendar-filters'
import { type FilterSelection, isSelected } from './filter-selection'

interface CalendarFiltersProps {
  filterOptions: CalendarFilterOptions
  filters: Filters
  /** True once the filters deviate from the default — enables Reset. */
  canReset: boolean
  onToggleVenue: (slug: string) => void
  onToggleType: (slug: string) => void
  onReset: () => void
}

function FilterChips({
  labelId,
  label,
  options,
  selection,
  onToggle,
}: {
  labelId: string
  label: string
  options: FilterOption[]
  selection: FilterSelection
  onToggle: (slug: string) => void
}) {
  const s = calendarFilters()
  return (
    <div className={s.filterRow}>
      <span className={s.filterRowLabel} id={labelId}>
        {label}
      </span>
      <ul className={s.chips} aria-labelledby={labelId}>
        {options.map((option) => (
          <li key={option.slug}>
            <Checkbox
              id={`${labelId}-${option.slug}`}
              label={option.label}
              count={option.count}
              checked={isSelected(selection, option.slug)}
              onCheckedChange={() => onToggle(option.slug)}
            />
          </li>
        ))}
      </ul>
    </div>
  )
}

export function CalendarFilters({
  filterOptions,
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
        <Button
          variant="secondary"
          size="sm"
          className={s.reset}
          onClick={onReset}
          disabled={!canReset}
        >
          <RiResetLeftLine size={14} aria-hidden />
          Reset
        </Button>
      </div>

      {filterOptions.venues.length > 1 && (
        <FilterChips
          labelId="filter-venue"
          label="Venue"
          options={filterOptions.venues}
          selection={filters.venues}
          onToggle={onToggleVenue}
        />
      )}

      {filterOptions.types.length > 1 && (
        <FilterChips
          labelId="filter-type"
          label="Type"
          options={filterOptions.types}
          selection={filters.types}
          onToggle={onToggleType}
        />
      )}
    </div>
  )
}
