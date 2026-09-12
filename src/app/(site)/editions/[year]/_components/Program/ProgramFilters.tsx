'use client'

import { useProgram } from '@program/ProgramContext'
import { programFilters } from '@program/ProgramFilters.recipe'
import { type FilterOption, type FilterSelection, isSelected } from '@program/program-filters'
import { RiResetLeftLine } from '@remixicon/react'
import { HStack, Stack, Text, Wrap } from 'styled-system/jsx'
import { Button } from '@/components/ui/Button/Button'
import { Checkbox } from '@/components/ui/Checkbox/Checkbox'

const s = programFilters()

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
  return (
    <Stack className={s.filterRow} gap="sm">
      <Text variant="label" className={s.filterRowLabel} id={labelId}>
        {label}
      </Text>
      <Wrap as="ul" listStyle="none" aria-labelledby={labelId}>
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
      </Wrap>
    </Stack>
  )
}

export function ProgramFilters() {
  const { state, actions } = useProgram()
  const { filterOptions, filters, view } = state

  const showVenues = filterOptions.venues.length > 1
  const showTypes = filterOptions.types.length > 1
  if (!showVenues && !showTypes) return null

  return (
    <Stack role="group" aria-label="Filter the program">
      {showVenues && (
        <FilterChips
          labelId="filter-venue"
          label="Venue"
          options={filterOptions.venues}
          selection={filters.venues}
          onToggle={actions.toggleVenue}
        />
      )}

      {showTypes && (
        <FilterChips
          labelId="filter-type"
          label="Type"
          options={filterOptions.types}
          selection={filters.types}
          onToggle={actions.toggleType}
        />
      )}

      {view.canReset && (
        <HStack justify="flex-end">
          <Button variant="quiet" size="sm" onClick={actions.reset}>
            <RiResetLeftLine size={14} aria-hidden />
            Reset
          </Button>
        </HStack>
      )}
    </Stack>
  )
}
