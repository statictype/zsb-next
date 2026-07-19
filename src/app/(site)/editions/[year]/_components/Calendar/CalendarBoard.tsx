'use client'

import { calendar } from '@calendar/Calendar.recipe'
import type { CalendarView } from '@calendar/calendar-filters'
import { TypeChips } from '@calendar/TypeChips'
import { VenueLine } from '@calendar/VenueLine'
import Link from 'next/link'
import type { ReactNode } from 'react'
import { Divider, Grid, HStack, Stack, Text, Wrap } from 'styled-system/jsx'
import { Figure } from '@/components/Figure/Figure'
import { Button } from '@/components/ui/Button/Button'
import { Collapsible } from '@/components/ui/Collapsible/Collapsible'
import { formatShortRange } from '@/lib/edition-dates'
import type { CalendarListEvent } from '@/types/edition'

// No variants — one shared instance for the board + its row/collapse pieces.
const s = calendar()

interface CalendarBoardProps {
  view: CalendarView
  year: number
  /** Restore the default filters — wired to the empty state's "Show all". */
  onReset: () => void
}

/**
 * The board itself — empty state, "Ongoing" run grid, day-by-day agenda — a
 * pure render of a derived `CalendarView`. All decisions (filtering, counts,
 * past-greying clock) arrive on the view; the interactive shell (`Calendar`)
 * owns the hooks.
 */
export function CalendarBoard({ view, year, onReset }: CalendarBoardProps) {
  const { visible, onView, days, liveClock } = view

  if (visible.length === 0) {
    return (
      <Stack className={s.empty} role="status">
        <Text as="p" variant="heading" className={s.emptyText}>
          No events match these filters.
        </Text>
        <Button variant="link" className={s.emptyClear} onClick={onReset}>
          <Text variant="label">Show all events</Text>
        </Button>
      </Stack>
    )
  }

  // Ongoing exhibitions sit on top as a card grid; the one-off events
  // follow below as the day-by-day agenda (ZSB-49).
  return (
    <Stack className={s.layout} gap="2xl">
      {onView.length > 0 && (
        <Stack gap="lg">
          <Divider />
          <Stack as="section" gap="md" aria-label="Ongoing throughout the edition">
            <Text as="h3" variant="label" className={s.bandLabel}>
              Ongoing
            </Text>
            <Grid
              as="ul"
              minChildWidth="300px"
              gap="md"
              columns={{ base: 1, md: 2, lg: 3, '4xl': 4 }}
              listStyle="none"
            >
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
                      <Text as="h4" variant="calendar" color="white">
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
  )
}

// On a finished edition the full board is kept as the historical record but
// folded behind a Collapsible so the recap leads (ZSB-45); live/upcoming editions
// render the board directly without mounting a redundant Collapsible.
export function ArchiveCollapse({
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

export function EventRow({ event, year }: { event: CalendarListEvent; year: number }) {
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
        <Text as="h4" variant="calendar" color="white">
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
