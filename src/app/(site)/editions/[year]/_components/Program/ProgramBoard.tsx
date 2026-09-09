'use client'

import { program } from '@program/Program.recipe'
import type { ProgramView } from '@program/program-filters'
import { TypeChips } from '@program/TypeChips'
import { VenueLine } from '@program/VenueLine'
import Link from 'next/link'
import type { ReactNode } from 'react'
import { css } from 'styled-system/css'
import { Grid, HStack, Stack, Text, Wrap } from 'styled-system/jsx'
import { Figure } from '@/components/Figure/Figure'
import { Button } from '@/components/ui/Button/Button'
import { Collapsible } from '@/components/ui/Collapsible/Collapsible'
import { formatShortRange } from '@/lib/edition-dates'
import type { CalendarListEvent } from '@/types/edition'

// No variants — one shared instance for the board + its row/collapse pieces.
const s = program()

interface ProgramBoardProps {
  view: ProgramView
  year: number
  /** Restore the default filters — wired to the empty state's "Show all". */
  onReset: () => void
}

/**
 * The board itself — empty state, "Ongoing" run grid, day-by-day list — a
 * pure render of a derived `ProgramView`. All decisions (filtering, counts,
 * past-greying clock) arrive on the view; the interactive shell (`Program`)
 * owns the hooks.
 */
export function ProgramBoard({ view, year, onReset }: ProgramBoardProps) {
  const { visible, ongoing, days, liveClock } = view

  if (visible.length === 0) {
    return (
      <div className={s.layout}>
        <Stack className={s.empty} role="status">
          <Text as="p" variant="heading" className={s.emptyText}>
            No events match these filters.
          </Text>
          <Button variant="secondary" size="sm" onClick={onReset}>
            Show all events
          </Button>
        </Stack>
      </div>
    )
  }

  // Ongoing exhibitions sit on top as a card grid; the one-off events
  // follow below as the day-by-day list (ZSB-49).
  return (
    <Stack className={s.layout} gap="2xl">
      {ongoing.length > 0 && (
        <Stack as="section" gap="md" aria-label="Ongoing throughout the edition">
          <Text as="h3" variant="label" className={s.bandLabel}>
            Ongoing
          </Text>
          <Grid as="ul" gap="md" columns={{ base: 1, md: 2, lg: 3, '4xl': 4 }} listStyle="none">
            {ongoing.map((run) => {
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
                    <Text as="h4" variant="body" color="heading" className={s.eventName}>
                      <Link
                        className={s.nameButton}
                        href={`/editions/${year}/events/${run.slug}`}
                        scroll={false}
                      >
                        {run.name}
                      </Link>
                    </Text>
                    <VenueLine venue={run.venue} />
                    {runRange && (
                      <Text className={s.runFoot} variant="label">
                        {runRange}
                      </Text>
                    )}
                  </Stack>
                </li>
              )
            })}
          </Grid>
        </Stack>
      )}

      {days.length > 0 && (
        <section aria-labelledby="program-day-by-day-heading">
          {/* Pairs with the Ongoing band's own h3 — without it the event names
              jump from the section h2 straight to h4. */}
          <h3 id="program-day-by-day-heading" className={css({ layerStyle: 'srOnly' })}>
            Day by day
          </h3>
          <ol className={s.dayByDay}>
            {days.map((day) => {
              const today = day.iso === liveClock
              return (
                <Stack
                  as="li"
                  key={day.iso}
                  className={s.day}
                  data-past={liveClock !== null && day.iso < liveClock}
                  data-today={today}
                  aria-current={today ? 'date' : undefined}
                >
                  <HStack
                    className={s.marker}
                    flexDirection={{ base: 'row', md: 'column' }}
                    alignItems={{ base: 'baseline', md: 'flex-end' }}
                    gap={{ base: 'md', md: 'sm' }}
                  >
                    <Text variant="label">{day.token.weekday}</Text>
                    <span className={s.markerDay}>{day.token.dayPadded}</span>
                    <Text variant="label">{day.token.month}</Text>
                  </HStack>
                  <ul className={s.events}>
                    {day.events.map((event) => (
                      <EventRow key={event.key} event={event} year={year} />
                    ))}
                  </ul>
                </Stack>
              )
            })}
          </ol>
        </section>
      )}
    </Stack>
  )
}

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
      id="program-archive"
      className={s.archive}
      closedLabel="Browse the full program"
      openLabel="Hide the full program"
      meta={`${count} ${count === 1 ? 'event' : 'events'}`}
    >
      {children}
    </Collapsible>
  )
}

export function EventRow({ event, year }: { event: CalendarListEvent; year: number }) {
  const hasMeta = !!event.startTime || event.types.length > 0
  return (
    <li className={s.event} data-poster={!!event.image}>
      <Stack className={s.eventBody} gap="sm">
        {hasMeta && (
          <Wrap>
            {event.startTime && (
              <Text variant="label" className={s.eventTime}>
                {event.startTime}
              </Text>
            )}
            <TypeChips types={event.types} />
          </Wrap>
        )}
        <Text as="h4" variant="body" color="heading" className={s.eventName}>
          <Link
            className={s.nameButton}
            href={`/editions/${year}/events/${event.slug}`}
            scroll={false}
          >
            {event.name}
          </Link>
        </Text>
        <VenueLine venue={event.venue} />
        {event.description && (
          <Text as="p" variant="caption" className={s.eventDesc}>
            {event.description}
          </Text>
        )}
      </Stack>
      {event.image && (
        <div className={s.poster}>
          <Figure image={event.image} sizes="(min-width: 1280px) 240px, 70vw" />
        </div>
      )}
    </li>
  )
}
