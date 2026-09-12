'use client'

import { HashScroller } from '@program/HashScroller'
import { program } from '@program/Program.recipe'
import { ArchiveCollapse, ProgramBoard } from '@program/ProgramBoard'
import { ProgramFilters } from '@program/ProgramFilters'
import { ProgramShare } from '@program/ProgramShare'
import { deriveProgramView, type ProgramFilterOptions } from '@program/program-filters'
import { useProgramFilters } from '@program/useProgramFilters'
import { RiHistoryLine } from '@remixicon/react'
import { Container, HStack, Stack, Text, Wrap } from 'styled-system/jsx'
import { section } from 'styled-system/recipes'
import { Button } from '@/components/ui/Button/Button'
import { SectionHeading } from '@/components/ui/SectionHeading/SectionHeading'
import { PROGRAM_SECTION_ID } from '@/lib/edition-href'
import { useTodayIso } from '@/lib/use-today-iso'
import type { CalendarEvent } from '@/types/edition'

const s = program()

interface ProgramProps {
  year: number
  events: CalendarEvent[]
  filterOptions: ProgramFilterOptions
}

export function Program({ year, events, filterOptions }: ProgramProps) {
  const todayIso = useTodayIso()
  const { filters, toggleVenue, toggleType, setShowPast, reset } = useProgramFilters(filterOptions)
  const view = deriveProgramView(events, filters, todayIso)
  const { ended, countLabel, past, showPast, showPastControl, canReset } = view

  return (
    <section
      className={section({ ground: 'dark', rhythm: 'joined' })}
      aria-label={ended ? 'Program' : undefined}
      aria-labelledby={ended ? undefined : 'program-heading'}
    >
      {/* Zero-size anchor, past the section's own top padding — a shared link
          scrolls here instead of landing on blank padding. Nav clearance
          comes from the page shell's `scroll-padding-top` (globals.css). */}
      <div id={PROGRAM_SECTION_ID} />
      <HashScroller id={PROGRAM_SECTION_ID} />
      <Container>
        <Stack gap="xl">
          {!ended && (
            <Stack as="header" gap="md">
              <SectionHeading id="program-heading" flush>
                Program
              </SectionHeading>
              <HStack justify="space-between" alignItems="flex-start" gap="md">
                <Wrap gap="md">
                  <Text variant="label" className={s.count} aria-live="polite">
                    {countLabel}
                  </Text>
                  {showPastControl && (
                    <Button
                      variant="secondary"
                      size="sm"
                      aria-pressed={showPast}
                      onClick={() => setShowPast(!showPast)}
                    >
                      <RiHistoryLine size={15} aria-hidden />
                      {showPast ? 'Hide' : 'Show'} {past} past {past === 1 ? 'event' : 'events'}
                    </Button>
                  )}
                </Wrap>
                <ProgramShare />
              </HStack>
            </Stack>
          )}

          <ArchiveCollapse ended={ended} count={events.length}>
            <Stack gap="2xl">
              <ProgramFilters
                filterOptions={filterOptions}
                filters={filters}
                canReset={canReset}
                onToggleVenue={toggleVenue}
                onToggleType={toggleType}
                onReset={reset}
              />
              <ProgramBoard view={view} year={year} onReset={reset} />
            </Stack>
          </ArchiveCollapse>
        </Stack>
      </Container>
    </section>
  )
}
