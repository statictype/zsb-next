'use client'

import { RiHistoryLine } from '@remixicon/react'
import Link from 'next/link'
import { type ReactNode, useEffect, useMemo, useRef } from 'react'
import { cx } from 'styled-system/css'
import { section } from 'styled-system/recipes'
import { Figure } from '@/components/Figure/Figure'
import { Badge } from '@/components/ui/Badge/Badge'
import { Button } from '@/components/ui/Button/Button'
import { Collapsible } from '@/components/ui/Collapsible/Collapsible'
import { SectionHeading } from '@/components/ui/SectionHeading/SectionHeading'
import {
  type DayToken,
  dayToken,
  formatShortRange,
  isMultiDayRun,
  isPastEvent,
} from '@/lib/edition-dates'
import { useTodayIso } from '@/lib/use-today-iso'
import type { CalendarEvent } from '@/types/edition'
import { calendar } from './Calendar.recipe'
import { CalendarFilters } from './CalendarFilters'
import { CalendarShare, PROGRAM_SECTION_ID } from './CalendarShare'
import type { SocialLink } from './ComingSoon'
import {
  applyFilters,
  computeFacets,
  editionWindow,
  hasActiveFilters,
  hasPastEvents,
  hasUpcomingEvents,
  matchesFacets,
  resolveShowPast,
} from './calendar-filters'
import { useCalendarFilters } from './useCalendarFilters'

// No variants — one shared instance for the component + its module-level helpers.
const s = calendar()

interface CalendarProps {
  year: number
  events: CalendarEvent[]
  /** Edition theme, for the finished-edition recap line (ZSB-45). */
  theme?: string
  /** Follow CTAs for the finished-edition recap (ZSB-45); empty hides them. */
  socials?: SocialLink[]
}

interface AgendaDay {
  iso: string
  token: DayToken
  events: CalendarEvent[]
}

interface Schedule {
  /** Multi-day runs (exhibitions) — shown in the "Ongoing" band, each with its range. */
  onView: CalendarEvent[]
  /** Single-day events, grouped and ordered by date. */
  days: AgendaDay[]
}

// Untimed events sort before timed ones (empty string < "18:00"); ties break
// by name so the order is stable across renders.
function byTimeThenName(a: CalendarEvent, b: CalendarEvent): number {
  return (a.startTime ?? '').localeCompare(b.startTime ?? '') || a.name.localeCompare(b.name)
}

// Split events into the "Ongoing" multi-day runs and the day-by-day agenda.
// Pure so it stays cheap to memoize and test. The edition window is measured
// separately (see `editionWindow`) on the full, unfiltered set.
function buildSchedule(events: CalendarEvent[]): Schedule {
  const onView: CalendarEvent[] = []
  const byDay = new Map<string, CalendarEvent[]>()

  for (const event of events) {
    if (isMultiDayRun(event.startDate, event.endDate)) {
      onView.push(event)
    } else {
      const bucket = byDay.get(event.startDate)
      if (bucket) bucket.push(event)
      else byDay.set(event.startDate, [event])
    }
  }

  onView.sort(
    (a, b) =>
      a.startDate.localeCompare(b.startDate) ||
      (a.endDate ?? '').localeCompare(b.endDate ?? '') ||
      a.name.localeCompare(b.name),
  )

  const days: AgendaDay[] = [...byDay.keys()]
    .sort((a, b) => a.localeCompare(b))
    .map((iso) => ({
      iso,
      token: dayToken(iso) ?? {
        weekday: '',
        weekdayLong: '',
        day: 0,
        dayPadded: '',
        month: '',
        monthLong: '',
        year: 0,
      },
      events: (byDay.get(iso) ?? []).sort(byTimeThenName),
    }))

  return { onView, days }
}

export function Calendar({ year, events, theme, socials = [] }: CalendarProps) {
  const todayIso = useTodayIso()
  const facets = useMemo(() => computeFacets(events), [events])
  const { filters, toggleVenue, toggleType, setShowPast, reset } = useCalendarFilters(facets)

  // A shared link arrives as `/editions/<year>#program`, but the programme
  // streams in behind the route's Suspense boundary (loading.tsx) — so the
  // browser's native fragment scroll usually fires before this section exists
  // and is lost. Re-run it once on mount, when the element is guaranteed here.
  const sectionRef = useRef<HTMLElement>(null)
  useEffect(() => {
    if (window.location.hash === `#${PROGRAM_SECTION_ID}`) {
      sectionRef.current?.scrollIntoView({ behavior: 'instant' })
    }
  }, [])

  // Narrow to the active selection, then build the schedule from what's left.
  const visible = useMemo(
    () => applyFilters(events, filters, todayIso),
    [events, filters, todayIso],
  )
  const { onView, days } = useMemo(() => buildSchedule(visible), [visible])

  // Edition window + live/ended judged on the WHOLE edition, never the filtered
  // subset — filtering to past-only on a live edition must keep the live "past"
  // greying, not flip the board into clean-archive mode.
  const [editionStart, editionEnd] = useMemo(() => editionWindow(events), [events])
  const ended = todayIso !== null && editionEnd !== null && todayIso > editionEnd
  const live = todayIso !== null && !ended

  // Filter affordances. The past toggle only appears when it would actually
  // change the view (the edition has both past and upcoming events); Reset
  // lights up once the filters deviate from the all-selected default.
  const showPast = resolveShowPast(filters, events, todayIso)
  // The past toggle lives in the headline now (ZSB-47); it shows whenever past
  // events could be revealed — i.e. a live edition with both past and upcoming.
  const showPastControl =
    todayIso !== null && hasPastEvents(events, todayIso) && hasUpcomingEvents(events, todayIso)
  const showFilterBar = facets.venues.length > 1 || facets.types.length > 1
  const canReset = hasActiveFilters(filters)

  const windowLabel =
    editionStart && editionEnd ? formatShortRange(editionStart, editionEnd) : undefined

  // Headline counts (ZSB-47). Upcoming/past split is judged client-side, so
  // before the clock resolves (`todayIso === null`) we just count everything as
  // "upcoming" and show no past affordance — matching the all-events shell.
  // `upcomingMatching` reacts to the venue/type filters; `upcoming`/`past` are
  // whole-edition totals, independent of the selection.
  const { upcoming, upcomingMatching, past } = useMemo(() => {
    if (todayIso === null) {
      return { upcoming: events.length, upcomingMatching: events.length, past: 0 }
    }
    let up = 0
    let match = 0
    let pastCount = 0
    for (const e of events) {
      if (isPastEvent(e, todayIso)) pastCount++
      else {
        up++
        if (matchesFacets(e, filters)) match++
      }
    }
    return { upcoming: up, upcomingMatching: match, past: pastCount }
  }, [events, filters, todayIso])

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
      ref={sectionRef}
      className={cx(section({ ground: 'dark' }), s.section)}
      aria-labelledby="calendar-heading"
    >
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
                          <Button asChild variant="text">
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
                  <button
                    type="button"
                    className={s.pastToggle}
                    data-on={showPast}
                    aria-pressed={showPast}
                    onClick={() => setShowPast(!showPast)}
                  >
                    <RiHistoryLine size={15} aria-hidden />
                    {showPast ? 'Hide' : 'Show'} {past} past {past === 1 ? 'event' : 'events'}
                  </button>
                )}
              </div>
            )}
          </div>
          <CalendarShare />
        </header>

        {/* On a finished edition the filters and the board fold into the archive
            disclosure together (ZSB-45), so filtering still works once expanded;
            a live edition renders them inline. */}
        <ArchiveCollapse ended={ended} count={events.length}>
          {showFilterBar && (
            <CalendarFilters
              facets={facets}
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
              <button type="button" className={s.emptyClear} onClick={reset}>
                Show all events
              </button>
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
                      const past = live && runEnd < todayIso!
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
                    <li key={day.iso} className={s.day} data-past={live && day.iso < todayIso!}>
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
// render the board directly without mounting a redundant disclosure control.
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

function TypeChips({ event }: { event: CalendarEvent }) {
  return (
    <ul className={s.chips}>
      {event.types.map((t) => (
        <li key={`${event.key}-${t.slug}`}>
          <Badge tone="outline" size="sm">
            {t.title}
          </Badge>
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

function EventRow({ event, year }: { event: CalendarEvent; year: number }) {
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
