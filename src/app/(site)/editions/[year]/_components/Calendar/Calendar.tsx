'use client'

import { RiHistoryLine } from '@remixicon/react'
import Link from 'next/link'
import type { ReactNode } from 'react'
import { cx } from 'styled-system/css'
import { Container, Divider, Grid, HStack, Stack, Text, Wrap } from 'styled-system/jsx'
import { section } from 'styled-system/recipes'
import { Figure } from '@/components/Figure/Figure'
import { Button } from '@/components/ui/Button/Button'
import { Collapsible } from '@/components/ui/Collapsible/Collapsible'
import { SectionHeading } from '@/components/ui/SectionHeading/SectionHeading'
import { editionWindow, formatShortRange } from '@/lib/edition-dates'
import { useTodayIso } from '@/lib/use-today-iso'
import type { CalendarEvent, CalendarListEvent } from '@/types/edition'
import { calendar } from './Calendar.recipe'
import { CalendarFilters } from './CalendarFilters'
import { CalendarMeta } from './CalendarMeta'
import { CalendarShare, PROGRAM_SECTION_ID } from './CalendarShare'
import { type CalendarFilterOptions, deriveCalendarView } from './calendar-filters'
import { FollowLinks, type SocialLink } from './FollowLinks'
import { HashScroller } from './HashScroller'
import { TypeChips } from './TypeChips'
import { useCalendarFilters } from './useCalendarFilters'
import { VenueLine } from './VenueLine'

// No variants — one shared instance for the component + its module-level helpers.
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

export function Calendar({ year, events, filterOptions, theme, socials = [] }: CalendarProps) {
  const todayIso = useTodayIso()
  const { filters, toggleVenue, toggleType, setShowPast, reset } = useCalendarFilters(filterOptions)

  const {
    visible,
    onView,
    days,
    upcoming,
    upcomingMatching,
    past,
    showPast,
    showPastControl,
    canReset,
  } = deriveCalendarView(events, filters, todayIso)

  // Edition window + live/ended judged on the WHOLE edition, never the filtered
  // subset — filtering to past-only on a live edition must keep the live "past"
  // greying, not flip the board into clean-archive mode.
  const [editionStart, editionEnd] = editionWindow(events)
  const ended = todayIso !== null && editionEnd !== null && todayIso > editionEnd
  // Non-null exactly while the edition is live; the `past` checks below read
  // it so narrowing flows instead of needing `todayIso!` assertions.
  const liveClock = ended ? null : todayIso

  const showFilterBar = filterOptions.venues.length > 1 || filterOptions.types.length > 1

  const windowLabel =
    editionStart && editionEnd ? formatShortRange(editionStart, editionEnd) : undefined

  // "X of Y upcoming events", collapsing to "Y upcoming events" when the venue/
  // type filters aren't narrowing anything. A finished edition (nothing upcoming)
  // falls back to a plain archive total — its recap treatment is ZSB-45.
  const countLabel =
    upcoming === 0
      ? `${events.length} ${events.length === 1 ? 'event' : 'events'}`
      : upcomingMatching === upcoming
        ? `${upcoming} upcoming ${upcoming === 1 ? 'event' : 'events'}`
        : `${upcomingMatching} of ${upcoming} upcoming events`

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
                // A finished edition leads with a short recap + follow CTAs; its
                // archive agenda collapses below (ZSB-45). Applies to every
                // finished edition, judged client-side like the rest of the board.
                <Stack className={s.recap}>
                  <Text as="p" variant="body">
                    That was{' '}
                    <Text as="strong" variant="body" className={s.recapMark}>
                      ZSB {year}
                    </Text>
                    {theme ? ` — ${theme}` : ''}.
                  </Text>
                  <FollowLinks label="Follow for what’s next" socials={socials} />
                </Stack>
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

              {visible.length === 0 ? (
                <Stack className={s.empty} role="status">
                  <Text as="p" variant="heading" className={s.emptyText}>
                    No events match these filters.
                  </Text>
                  <Button variant="link" className={s.emptyClear} onClick={reset}>
                    <Text variant="label">Show all events</Text>
                  </Button>
                </Stack>
              ) : (
                // Ongoing exhibitions sit on top as a card grid; the one-off events
                // follow below as the day-by-day agenda (ZSB-49).
                <Stack className={s.layout} gap="2xl">
                  {onView.length > 0 && (
                    <Stack gap="lg">
                      <Divider />
                      <Stack as="section" gap="md" aria-label="Ongoing throughout the edition">
                        <Text as="h3" variant="label" className={s.bandLabel}>
                          Ongoing
                        </Text>
                        <Grid as="ul" minChildWidth="300px" gap="md" listStyle="none">
                          {onView.map((run) => {
                            const runEnd = run.endDate ?? run.startDate
                            const past = liveClock !== null && runEnd < liveClock
                            // Every run carries its own span — runs cover different
                            // stretches of the edition, so a shared band range read as
                            // "everything runs these dates" (ZSB-48).
                            const runRange = formatShortRange(run.startDate, runEnd)
                            return (
                              <li key={run.key} className={s.run} data-past={past}>
                                {run.image && (
                                  <div className={s.runMedia}>
                                    <Figure
                                      image={run.image}
                                      sizes="(min-width: 1280px) 360px, (min-width: 768px) 45vw, 90vw"
                                    />
                                  </div>
                                )}
                                <Stack className={s.runContent} gap="sm">
                                  <TypeChips types={run.types} />
                                  <Text as="h4" variant="heading">
                                    <Link
                                      className={s.nameButton}
                                      href={`/editions/${year}/events/${run.slug}`}
                                      scroll={false}
                                    >
                                      {run.name}
                                    </Link>
                                  </Text>
                                  <VenueLine venue={run.venue} />
                                  <Wrap className={s.runFoot} gap="md">
                                    {runRange && <Text variant="label">{runRange}</Text>}
                                  </Wrap>
                                </Stack>
                              </li>
                            )
                          })}
                        </Grid>
                      </Stack>
                    </Stack>
                  )}

                  {days.length > 0 && (
                    <ol className={s.agenda}>
                      {days.map((day) => (
                        <Stack
                          as="li"
                          key={day.iso}
                          className={s.day}
                          data-past={liveClock !== null && day.iso < liveClock}
                        >
                          <HStack
                            className={s.marker}
                            flexDirection={{ base: 'row', md: 'column' }}
                            alignItems={{ base: 'baseline', md: 'flex-end' }}
                            gap={{ base: 'md', md: 'sm' }}
                          >
                            <span className={s.markerNode} aria-hidden />
                            <span className={s.markerDay}>{day.token.dayPadded}</span>
                            <HStack
                              as="span"
                              flexDirection={{ base: 'row', md: 'column' }}
                              alignItems={{ base: 'baseline', md: 'flex-end' }}
                              gap={{ md: 'xs' }}
                            >
                              <Text variant="label">{day.token.month}</Text>
                              <Text variant="label" className={s.markerWeekday}>
                                {day.token.weekday}
                              </Text>
                            </HStack>
                          </HStack>
                          <ul className={s.events}>
                            {day.events.map((event) => (
                              <EventRow key={event.key} event={event} year={year} />
                            ))}
                          </ul>
                        </Stack>
                      ))}
                    </ol>
                  )}
                </Stack>
              )}
            </Stack>
          </ArchiveCollapse>
        </Stack>
      </Container>
    </section>
  )
}

// On a finished edition the full board is kept as the historical record but
// folded behind a Collapsible so the recap leads (ZSB-45); live/upcoming editions
// render the board directly without mounting a redundant Collapsible.
function ArchiveCollapse({
  ended,
  count,
  children,
}: {
  ended: boolean
  count: number
  children: ReactNode
}) {
  if (!ended) return <>{children}</>
  return (
    <Collapsible
      id="calendar-archive"
      closedLabel="View full programme"
      openLabel="Hide full programme"
      meta={`${count} ${count === 1 ? 'event' : 'events'}`}
    >
      {children}
    </Collapsible>
  )
}

function EventRow({ event, year }: { event: CalendarListEvent; year: number }) {
  return (
    <li className={s.event} data-poster={!!event.image}>
      <Stack className={s.eventBody} gap="sm">
        <Wrap>
          {event.startTime && (
            <Text variant="label" className={s.eventTime}>
              {event.startTime}
            </Text>
          )}
          <TypeChips types={event.types} />
          {event.image && (
            <Text variant="label" className={s.posterTag}>
              Poster
            </Text>
          )}
        </Wrap>
        {/* The name links to the event's route (the modal opens over the
            edition); its stretched overlay makes the whole row the hit target
            (see `.nameButton` in the CSS). */}
        <Text as="h4" variant="heading">
          <Link
            className={s.nameButton}
            href={`/editions/${year}/events/${event.slug}`}
            scroll={false}
          >
            {event.name}
          </Link>
        </Text>
        <VenueLine venue={event.venue} />
        <Text as="p" variant="caption" className={s.eventDesc}>
          {event.description}
        </Text>
      </Stack>
      {event.image && (
        <div className={s.poster}>
          <Figure image={event.image} sizes="(min-width: 1280px) 240px, 70vw" />
        </div>
      )}
    </li>
  )
}
