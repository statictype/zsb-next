'use client'

import type { SocialLink } from '@program/FollowLinks'
import { HashScroller } from '@program/HashScroller'
import { program } from '@program/Program.recipe'
import { ArchiveCollapse, ProgramBoard } from '@program/ProgramBoard'
import { ProgramFilters } from '@program/ProgramFilters'
import { ProgramRecap } from '@program/ProgramRecap'
import { ProgramShare } from '@program/ProgramShare'
import { deriveProgramView, type ProgramFilterOptions } from '@program/program-filters'
import { useProgramFilters } from '@program/useProgramFilters'
import { RiHistoryLine } from '@remixicon/react'
import { cx } from 'styled-system/css'
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
  /** Venue/type facets across the whole edition — computed once server-side
   *  (`computeFilterOptions` is pure aggregation, independent of the visitor's
   *  clock or selection, so there's no reason to recompute it on every render). */
  filterOptions: ProgramFilterOptions
  /** Edition theme, for the finished-edition recap line (ZSB-45). */
  theme?: string
  /** Follow CTAs for the finished-edition recap (ZSB-45); empty hides them. */
  socials?: SocialLink[]
}

/**
 * The interactive shell: the client clock, the URL filter store, one
 * `deriveProgramView` call, and composition. Everything it renders below the
 * header is a pure piece (`ProgramBoard`, `ProgramRecap`) of the derived view.
 */
export function Program({ year, events, filterOptions, theme, socials = [] }: ProgramProps) {
  const todayIso = useTodayIso()
  const { filters, toggleVenue, toggleType, setShowPast, reset } = useProgramFilters(filterOptions)
  const view = deriveProgramView(events, filters, todayIso)
  const { ended, countLabel, past, showPast, showPastControl, canReset } = view

  const showFilterBar = filterOptions.venues.length > 1 || filterOptions.types.length > 1

  return (
    <section
      className={cx(section({ ground: 'dark', rhythm: 'joined' }), s.section)}
      aria-labelledby="program-heading"
    >
      {/* Zero-size anchor, past the section's own top padding — a shared link
          scrolls here instead of landing on blank padding. Nav clearance
          comes from the page shell's `scroll-padding-top` (globals.css). */}
      <div id={PROGRAM_SECTION_ID} />
      <HashScroller id={PROGRAM_SECTION_ID} />
      <Container>
        <Stack gap="xl">
          <Stack as="header" gap="md">
            <SectionHeading id="program-heading" flush>
              Program
            </SectionHeading>
            {ended ? (
              <ProgramRecap year={year} theme={theme} socials={socials} />
            ) : (
              <HStack justify="space-between" alignItems="flex-start" gap="md">
                <Wrap gap="md">
                  <Text variant="label" className={s.count} aria-live="polite">
                    {countLabel}
                  </Text>
                  {showPastControl && (
                    <Button
                      variant="secondary"
                      size="sm"
                      className={s.pastToggle}
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
            )}
          </Stack>

          {/* On a finished edition the filters and the board fold into the archive
            Collapsible together (ZSB-45), so filtering still works once expanded;
            a live edition renders them inline. */}
          <ArchiveCollapse ended={ended} count={events.length}>
            <Stack gap="2xl">
              {showFilterBar && (
                <ProgramFilters
                  filterOptions={filterOptions}
                  filters={filters}
                  canReset={canReset}
                  onToggleVenue={toggleVenue}
                  onToggleType={toggleType}
                  onReset={reset}
                />
              )}
              <ProgramBoard view={view} year={year} onReset={reset} />
            </Stack>
          </ArchiveCollapse>
        </Stack>
      </Container>
    </section>
  )
}
