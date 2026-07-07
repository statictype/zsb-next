'use client'

import { RiHistoryLine } from '@remixicon/react'
import Link from 'next/link'
import type { ReactNode } from 'react'
import { cx } from 'styled-system/css'
import { section } from 'styled-system/recipes'
import { Figure } from '@/components/Figure/Figure'
import { Badge } from '@/components/ui/Badge/Badge'
import { Button } from '@/components/ui/Button/Button'
import { Collapsible } from '@/components/ui/Collapsible/Collapsible'
import { SectionHeading } from '@/components/ui/SectionHeading/SectionHeading'
import { editionWindow, formatShortRange } from '@/lib/edition-dates'
import { useTodayIso } from '@/lib/use-today-iso'
import type { CalendarEvent, CalendarListEvent } from '@/types/edition'
import { calendar } from './Calendar.recipe'
import { CalendarFilters } from './CalendarFilters'
import { CalendarShare, PROGRAM_SECTION_ID } from './CalendarShare'
import type { SocialLink } from './ComingSoon'
import { type CalendarFilterOptions, deriveCalendarView } from './calendar-filters'
import { HashScroller } from './HashScroller'
import { useCalendarFilters } from './useCalendarFilters'

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
      id={PROGRAM_SECTION_ID}
      className={cx(section({ ground: 'dark' }), s.section)}
      aria-labelledby="calendar-heading"
    >
      <HashScroller id={PROGRAM_SECTION_ID} />
      <div className={s.inner}>
        <header className={s.header}>
          <div className={s.headerMain}>
            <SectionHeading id="calendar-heading" flush>
              Calendar
            </SectionHeading>
            <p className={s.meta}>
              <span className={s.metaYear}>{year}</span>
              {windowLabel && (
                <>
                  <span className={s.metaDot} aria-hidden />
                  <span>{windowLabel}</span>
                </>
              )}
            </p>
            {ended ? (
              // A finished edition leads with a short recap + follow CTAs; its
              // archive agenda collapses below (ZSB-45). Applies to every
              // finished edition, judged client-side like the rest of the board.
              <div className={s.recap}>
                <p className={s.recapLine}>
                  That was <strong className={s.recapMark}>ZSB {year}</strong>
                  {theme ? ` — ${theme}` : ''}.
                </p>
                {socials.length > 0 && (
                  <div className={s.recapFollow}>
                    <span className={s.recapFollowLabel}>Follow for what&rsquo;s next</span>
                    <ul className={s.recapLinks}>
                      {socials.map((social) => (
                        <li key={social.label}>
                          <Button asChild variant="link">
                            <a href={social.href} target="_blank" rel="noreferrer">
                              {social.label}
                            </a>
                          </Button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div className={s.counts}>
                <span className={s.count} aria-live="polite">
                  {countLabel}
                </span>
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
              </div>
            )}
          </div>
          <CalendarShare />
        </header>

        {/* On a finished edition the filters and the board fold into the archive
            Collapsible together (ZSB-45), so filtering still works once expanded;
            a live edition renders them inline. */}
        <ArchiveCollapse ended={ended} count={events.length}>
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
            <div className={s.empty} role="status">
              <p className={s.emptyText}>No events match these filters.</p>
              <Button variant="link" className={s.emptyClear} onClick={reset}>
                Show all events
              </Button>
            </div>
          ) : (
            // Ongoing exhibitions sit on top as a card grid; the one-off events
            // follow below as the day-by-day agenda (ZSB-49).
            <div className={s.layout}>
              {onView.length > 0 && (
                <section className={s.band} aria-label="Ongoing throughout the edition">
                  <h3 className={s.bandLabel}>Ongoing</h3>
                  <ul className={s.runs}>
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
                          <div className={s.runContent}>
                            <TypeChips event={run} />
                            <h4 className={s.runName}>
                              <Link
                                className={s.nameButton}
                                href={`/editions/${year}/events/${run.slug}`}
                                scroll={false}
                              >
                                {run.name}
                              </Link>
                            </h4>
                            <VenueLine venue={run.venue} />
                            <div className={s.runFoot}>
                              {runRange && <span className={s.runRange}>{runRange}</span>}
                            </div>
                          </div>
                        </li>
                      )
                    })}
                  </ul>
                </section>
              )}

              {days.length > 0 && (
                <ol className={s.agenda}>
                  {days.map((day) => (
                    <li
                      key={day.iso}
                      className={s.day}
                      data-past={liveClock !== null && day.iso < liveClock}
                    >
                      <div className={s.marker}>
                        <span className={s.markerNode} aria-hidden />
                        <span className={s.markerDay}>{day.token.dayPadded}</span>
                        <span className={s.markerMeta}>
                          <span className={s.markerMonth}>{day.token.month}</span>
                          <span className={s.markerWeekday}>{day.token.weekday}</span>
                        </span>
                      </div>
                      <ul className={s.events}>
                        {day.events.map((event) => (
                          <EventRow key={event.key} event={event} year={year} />
                        ))}
                      </ul>
                    </li>
                  ))}
                </ol>
              )}
            </div>
          )}
        </ArchiveCollapse>
      </div>
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

// Narrowed to the render-boundary type so list rows (CalendarListEvent) and
// full events feed it alike without widening back to CalendarEvent.
function TypeChips({ event }: { event: Pick<CalendarListEvent, 'key' | 'types'> }) {
  return (
    <ul className={s.chips}>
      {event.types.map((t) => (
        <li key={`${event.key}-${t.slug}`}>
          <Badge tone="outline">{t.title}</Badge>
        </li>
      ))}
    </ul>
  )
}

function VenueLine({ venue }: { venue: CalendarEvent['venue'] }) {
  return (
    <p className={s.venue}>
      <span className={s.venueName}>{venue.name}</span>
      {venue.partOf && <span className={s.venueParent}>{venue.partOf.name}</span>}
    </p>
  )
}

function EventRow({ event, year }: { event: CalendarListEvent; year: number }) {
  return (
    <li className={s.event} data-poster={!!event.image}>
      <div className={s.eventBody}>
        <div className={s.eventTop}>
          {event.startTime && <span className={s.eventTime}>{event.startTime}</span>}
          <TypeChips event={event} />
          {event.image && <span className={s.posterTag}>Poster</span>}
        </div>
        {/* The name links to the event's route (the modal opens over the
            edition); its stretched overlay makes the whole row the hit target
            (see `.nameButton` in the CSS). */}
        <h4 className={s.eventName}>
          <Link
            className={s.nameButton}
            href={`/editions/${year}/events/${event.slug}`}
            scroll={false}
          >
            {event.name}
          </Link>
        </h4>
        <VenueLine venue={event.venue} />
        <p className={s.eventDesc}>{event.description}</p>
      </div>
      {event.image && (
        <div className={s.poster}>
          <Figure image={event.image} sizes="(min-width: 1280px) 240px, 70vw" />
        </div>
      )}
    </li>
  )
}
