'use client'

import { calendar } from '@calendar/Calendar.recipe'
import { ArchiveCollapse, CalendarBoard } from '@calendar/CalendarBoard'
import { CalendarFilters } from '@calendar/CalendarFilters'
import { CalendarMeta } from '@calendar/CalendarMeta'
import { CalendarRecap } from '@calendar/CalendarRecap'
import { CalendarShare, PROGRAM_SECTION_ID } from '@calendar/CalendarShare'
import { type CalendarFilterOptions, deriveCalendarView } from '@calendar/calendar-filters'
import type { SocialLink } from '@calendar/FollowLinks'
import { HashScroller } from '@calendar/HashScroller'
import { useCalendarFilters } from '@calendar/useCalendarFilters'
import { RiHistoryLine } from '@remixicon/react'
import { cx } from 'styled-system/css'
import { Container, HStack, Stack, Text, Wrap } from 'styled-system/jsx'
import { section } from 'styled-system/recipes'
import { Button } from '@/components/ui/Button/Button'
import { SectionHeading } from '@/components/ui/SectionHeading/SectionHeading'
import { useTodayIso } from '@/lib/use-today-iso'
import type { CalendarEvent } from '@/types/edition'

const s = calendar()

interface CalendarProps {
  year: number
  events: CalendarEvent[]
  /** Venue/type facets across the whole edition — computed once server-side
   *  (`computeFilterOptions` is pure aggregation, independent of the visitor's
   *  clock or selection, so there's no reason to recompute it on every render). */
  filterOptions: CalendarFilterOptions
  /** Edition theme, for the finished-edition recap line (ZSB-45). */
  theme?: string
  /** Follow CTAs for the finished-edition recap (ZSB-45); empty hides them. */
  socials?: SocialLink[]
}

/**
 * The interactive shell: the client clock, the URL filter store, one
 * `deriveCalendarView` call, and composition. Everything it renders below the
 * header is a pure piece (`CalendarBoard`, `CalendarRecap`) of the derived view.
 */
export function Calendar({ year, events, filterOptions, theme, socials = [] }: CalendarProps) {
  const todayIso = useTodayIso()
  const { filters, toggleVenue, toggleType, setShowPast, reset } = useCalendarFilters(filterOptions)
  const view = deriveCalendarView(events, filters, todayIso)
  const { ended, windowLabel, countLabel, past, showPast, showPastControl, canReset } = view

  const showFilterBar = filterOptions.venues.length > 1 || filterOptions.types.length > 1

  return (
    <section
      className={cx(section({ ground: 'dark' }), s.section)}
      aria-labelledby="calendar-heading"
    >
      {/* Zero-size anchor, past the section's own top padding — a shared link
          scrolls here instead of landing on blank padding. Nav clearance
          comes from the page shell's `scroll-padding-top` (globals.css). */}
      <div id={PROGRAM_SECTION_ID} />
      <HashScroller id={PROGRAM_SECTION_ID} />
      <Container>
        <Stack gap="xl">
          <HStack as="header" justify="space-between" gap="md">
            <Stack className={s.headerMain} gap="sm">
              <Stack gap="md">
                <SectionHeading id="calendar-heading" flush>
                  Calendar
                </SectionHeading>
                <CalendarMeta year={year} label={windowLabel} />
              </Stack>
              {ended ? (
                <CalendarRecap year={year} theme={theme} socials={socials} />
              ) : (
                <Wrap gap="md">
                  <Text variant="label" className={s.count} aria-live="polite">
                    {countLabel}
                  </Text>
                  {showPastControl && (
                    <Button
                      variant="secondary"
                      size="sm"
                      className={s.pastToggle}
                      data-on={showPast}
                      aria-pressed={showPast}
                      onClick={() => setShowPast(!showPast)}
                    >
                      <RiHistoryLine size={15} aria-hidden />
                      {showPast ? 'Hide' : 'Show'} {past} past {past === 1 ? 'event' : 'events'}
                    </Button>
                  )}
                </Wrap>
              )}
            </Stack>
            <CalendarShare />
          </HStack>

          {/* On a finished edition the filters and the board fold into the archive
            Collapsible together (ZSB-45), so filtering still works once expanded;
            a live edition renders them inline. */}
          <ArchiveCollapse ended={ended} count={events.length}>
            <Stack gap="2xl">
              {showFilterBar && (
                <CalendarFilters
                  filterOptions={filterOptions}
                  filters={filters}
                  canReset={canReset}
                  onToggleVenue={toggleVenue}
                  onToggleType={toggleType}
                  onReset={reset}
                />
              )}
              <CalendarBoard view={view} year={year} onReset={reset} />
            </Stack>
          </ArchiveCollapse>
        </Stack>
      </Container>
    </section>
  )
}
