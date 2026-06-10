'use client'

import { RiArrowDownSLine, RiArrowRightUpLine, RiHistoryLine } from '@remixicon/react'
import Link from 'next/link'
import { Fragment, type ReactNode, useEffect, useMemo, useRef, useSyncExternalStore } from 'react'
import { Figure } from '@/components/Figure/Figure'
import { type DayToken, dayToken, formatShortRange, isMultiDayRun } from '@/lib/edition-dates'
import type { CalendarEvent } from '@/types/edition'
import styles from './Calendar.module.css'
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
  isPastEvent,
  matchesFacets,
  resolveShowPast,
} from './calendar-filters'
import { useCalendarFilters } from './useCalendarFilters'

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

// Local "today" as an ISO `YYYY-MM-DD`, resolved on the client only — `null`
// on the server and during hydration, the real date thereafter. The page is
// cached, so past/upcoming has to be judged against the visitor's own clock;
// the null server snapshot keeps the cached HTML and first client render in
// sync (no hydration mismatch), then React swaps in the client value.
const subscribeNoop = () => () => {}

function getTodayIso(): string {
  const d = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

function useTodayIso(): string | null {
  return useSyncExternalStore(subscribeNoop, getTodayIso, () => null)
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

  // Where "now" falls in the agenda: the first day on or after today. When every
  // single-day event is behind us but the edition is still running (only multi-day
  // runs remain), the marker sits at the end.
  const nowIndex = useMemo(() => {
    if (!live || todayIso === null) return -1
    const idx = days.findIndex((d) => d.iso >= todayIso)
    return idx === -1 ? days.length : idx
  }, [days, live, todayIso])

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

  const todayToken = todayIso ? dayToken(todayIso) : undefined
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

  const NowMarker = (
    <li className={styles.now} aria-label="Happening now">
      <span className={styles.nowDot} aria-hidden />
      <span className={styles.nowLabel}>Now</span>
      {todayToken && (
        <span className={styles.nowDate}>
          {todayToken.weekday} {todayToken.day} {todayToken.month}
        </span>
      )}
      <span className={styles.nowRule} aria-hidden />
    </li>
  )

  return (
    <section
      id={PROGRAM_SECTION_ID}
      ref={sectionRef}
      className={styles.section}
      aria-labelledby="calendar-heading"
    >
      <div className={styles.inner}>
        <header className={styles.header}>
          <div className={styles.headerMain}>
            <h2 id="calendar-heading" className={styles.title}>
              Calendar
            </h2>
            <p className={styles.meta}>
              <span className={styles.metaYear}>{year}</span>
              {windowLabel && (
                <>
                  <span className={styles.metaDot} aria-hidden />
                  <span>{windowLabel}</span>
                </>
              )}
            </p>
            {ended ? (
              // A finished edition leads with a short recap + follow CTAs; its
              // archive agenda collapses below (ZSB-45). Applies to every
              // finished edition, judged client-side like the rest of the board.
              <div className={styles.recap}>
                <p className={styles.recapLine}>
                  That was <strong className={styles.recapMark}>ZSB {year}</strong>
                  {theme ? ` — ${theme}` : ''}.
                </p>
                {socials.length > 0 && (
                  <div className={styles.recapFollow}>
                    <span className={styles.recapFollowLabel}>Follow for what&rsquo;s next</span>
                    <ul className={styles.recapLinks}>
                      {socials.map((social) => (
                        <li key={social.label}>
                          <a
                            className={styles.recapLink}
                            href={social.href}
                            target="_blank"
                            rel="noreferrer"
                          >
                            {social.label} <RiArrowRightUpLine size={14} aria-hidden />
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div className={styles.counts}>
                <span className={styles.count} aria-live="polite">
                  {countLabel}
                </span>
                {showPastControl && (
                  <button
                    type="button"
                    className={`${styles.pastToggle} ${showPast ? styles.pastToggleOn : ''}`}
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
            <div className={styles.empty} role="status">
              <p className={styles.emptyText}>No events match these filters.</p>
              <button type="button" className={styles.emptyClear} onClick={reset}>
                Show all events
              </button>
            </div>
          ) : (
            // Ongoing exhibitions sit on top as a card grid; the one-off events
            // follow below as the day-by-day agenda (ZSB-49).
            <div className={styles.layout}>
              {onView.length > 0 && (
                <section className={styles.band} aria-label="Ongoing throughout the edition">
                  <h3 className={styles.bandLabel}>Ongoing</h3>
                  <ul className={styles.runs}>
                    {onView.map((run) => {
                      const runEnd = run.endDate ?? run.startDate
                      const status = !live
                        ? 'archive'
                        : runEnd < todayIso!
                          ? 'past'
                          : run.startDate <= todayIso!
                            ? 'now'
                            : 'upcoming'
                      // Every run carries its own span — runs cover different
                      // stretches of the edition, so a shared band range read as
                      // "everything runs these dates" (ZSB-48).
                      const runRange = formatShortRange(run.startDate, runEnd)
                      return (
                        <li
                          key={run.key}
                          className={`${styles.run} ${status === 'past' ? styles.isPast : ''} ${
                            status === 'now' ? styles.isNow : ''
                          }`}
                        >
                          {run.image && (
                            <div className={styles.runMedia}>
                              <Figure
                                image={run.image}
                                sizes="(min-width: 1280px) 360px, (min-width: 768px) 45vw, 90vw"
                              />
                            </div>
                          )}
                          <div className={styles.runContent}>
                            <TypeChips event={run} />
                            <h4 className={styles.runName}>
                              <Link
                                className={styles.nameButton}
                                href={`/editions/${year}/events/${run.slug}`}
                              >
                                {run.name}
                              </Link>
                            </h4>
                            <VenueLine venue={run.venue} />
                            <div className={styles.runFoot}>
                              {status === 'now' && <span className={styles.runNow}>On now</span>}
                              {runRange && <span className={styles.runRange}>{runRange}</span>}
                            </div>
                          </div>
                        </li>
                      )
                    })}
                  </ul>
                </section>
              )}

              {days.length > 0 && (
                <ol className={styles.agenda}>
                  {days.map((day, i) => (
                    <Fragment key={day.iso}>
                      {i === nowIndex && NowMarker}
                      <li
                        className={`${styles.day} ${live && day.iso < todayIso! ? styles.isPast : ''}`}
                      >
                        <div className={styles.marker}>
                          <span className={styles.markerNode} aria-hidden />
                          <span className={styles.markerDay}>{day.token.dayPadded}</span>
                          <span className={styles.markerMeta}>
                            <span className={styles.markerMonth}>{day.token.month}</span>
                            <span className={styles.markerWeekday}>{day.token.weekday}</span>
                          </span>
                        </div>
                        <ul className={styles.events}>
                          {day.events.map((event) => (
                            <EventRow key={event.key} event={event} year={year} />
                          ))}
                        </ul>
                      </li>
                    </Fragment>
                  ))}
                  {nowIndex === days.length && NowMarker}
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
// folded behind a disclosure so the recap leads (ZSB-45); live/upcoming editions
// render the board as-is. Native <details> — house style (VenuesView), no JS.
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
    <details className={styles.archive}>
      <summary className={styles.archiveSummary}>
        {/* Native <details> has no open state in JS — swap the label via [open]. */}
        <span className={styles.archiveShow}>View full programme</span>
        <span className={styles.archiveHide}>Hide full programme</span>
        <span className={styles.archiveCount}>
          {count} {count === 1 ? 'event' : 'events'}
        </span>
        <RiArrowDownSLine className={styles.archiveChevron} size={20} aria-hidden />
      </summary>
      <div className={styles.archivePanel}>{children}</div>
    </details>
  )
}

function TypeChips({ event }: { event: CalendarEvent }) {
  return (
    <ul className={styles.chips}>
      {event.types.map((t) => (
        <li key={`${event.key}-${t.slug}`} className={styles.chip}>
          {t.title}
        </li>
      ))}
    </ul>
  )
}

function VenueLine({ venue }: { venue: CalendarEvent['venue'] }) {
  return (
    <p className={styles.venue}>
      <span className={styles.venueName}>{venue.name}</span>
      {venue.partOf && <span className={styles.venueParent}>{venue.partOf.name}</span>}
    </p>
  )
}

function EventRow({ event, year }: { event: CalendarEvent; year: number }) {
  return (
    <li className={`${styles.event} ${event.image ? styles.hasPoster : ''}`}>
      <div className={styles.eventBody}>
        <div className={styles.eventTop}>
          {event.startTime && <span className={styles.eventTime}>{event.startTime}</span>}
          <TypeChips event={event} />
          {event.image && <span className={styles.posterTag}>Poster</span>}
        </div>
        {/* The name links to the event's route (the modal opens over the
            edition); its stretched overlay makes the whole row the hit target
            (see `.nameButton` in the CSS). */}
        <h4 className={styles.eventName}>
          <Link className={styles.nameButton} href={`/editions/${year}/events/${event.slug}`}>
            {event.name}
          </Link>
        </h4>
        <VenueLine venue={event.venue} />
        <p className={styles.eventDesc}>{event.description}</p>
      </div>
      {event.image && (
        <div className={styles.poster}>
          <Figure image={event.image} sizes="(min-width: 1280px) 240px, 70vw" />
        </div>
      )}
    </li>
  )
}
