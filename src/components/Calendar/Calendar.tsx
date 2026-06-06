'use client'

import { RiArrowRightUpLine } from '@remixicon/react'
import { Fragment, useMemo, useSyncExternalStore } from 'react'
import { Figure } from '@/components/Figure/Figure'
import { type DayToken, dayToken, formatShortRange, isMultiDayRun } from '@/lib/edition-dates'
import type { CalendarEvent } from '@/types/edition'
import styles from './Calendar.module.css'

interface CalendarProps {
  year: number
  events: CalendarEvent[]
}

interface AgendaDay {
  iso: string
  token: DayToken
  events: CalendarEvent[]
}

interface Schedule {
  /** Multi-day runs (exhibitions) — shown once in the "On view" band. */
  onView: CalendarEvent[]
  /** Single-day events, grouped and ordered by date. */
  days: AgendaDay[]
  /** [earliest start, latest end] across every event — the edition window. */
  windowStart: string | null
  windowEnd: string | null
}

// Untimed events sort before timed ones (empty string < "18:00"); ties break
// by name so the order is stable across renders.
function byTimeThenName(a: CalendarEvent, b: CalendarEvent): number {
  return (a.startTime ?? '').localeCompare(b.startTime ?? '') || a.name.localeCompare(b.name)
}

// Split events into the "On view" multi-day runs and the day-by-day agenda,
// and measure the overall window. Pure so it stays cheap to memoize and test.
function buildSchedule(events: CalendarEvent[]): Schedule {
  const onView: CalendarEvent[] = []
  const byDay = new Map<string, CalendarEvent[]>()
  let windowStart: string | null = null
  let windowEnd: string | null = null

  for (const event of events) {
    const end = event.endDate ?? event.startDate
    if (windowStart === null || event.startDate < windowStart) windowStart = event.startDate
    if (windowEnd === null || end > windowEnd) windowEnd = end

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

  return { onView, days, windowStart, windowEnd }
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

export function Calendar({ year, events }: CalendarProps) {
  const { onView, days, windowStart, windowEnd } = useMemo(() => buildSchedule(events), [events])
  const todayIso = useTodayIso()

  // Archive guard: once an edition is fully over, drop the past/now treatment
  // entirely — a finished edition reads as a clean record, not a greyed-out one.
  const ended = todayIso !== null && windowEnd !== null && todayIso > windowEnd
  const live = todayIso !== null && !ended

  // Where "now" falls in the agenda: the first day on or after today. When every
  // single-day event is behind us but the edition is still running (only multi-day
  // runs remain), the marker sits at the end.
  const nowIndex = useMemo(() => {
    if (!live || todayIso === null) return -1
    const idx = days.findIndex((d) => d.iso >= todayIso)
    return idx === -1 ? days.length : idx
  }, [days, live, todayIso])

  const todayToken = todayIso ? dayToken(todayIso) : undefined
  const windowLabel =
    windowStart && windowEnd ? formatShortRange(windowStart, windowEnd) : undefined
  const onViewLabel =
    onView.length > 0
      ? formatShortRange(
          onView[0]!.startDate,
          onView.reduce(
            (max, r) => ((r.endDate ?? r.startDate) > max ? (r.endDate ?? r.startDate) : max),
            onView[0]!.endDate ?? onView[0]!.startDate,
          ),
        )
      : undefined

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
    <section className={styles.section} aria-labelledby="calendar-heading">
      <div className={styles.inner}>
        <header className={styles.header}>
          <p className={styles.eyebrow}>Programme</p>
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
            <span className={styles.metaDot} aria-hidden />
            <span>
              {events.length} {events.length === 1 ? 'event' : 'events'}
            </span>
          </p>
        </header>

        {onView.length > 0 && (
          <section className={styles.band} aria-label="On view throughout the edition">
            <div className={styles.bandHead}>
              <h3 className={styles.bandLabel}>On view</h3>
              {onViewLabel && <span className={styles.bandRange}>{onViewLabel}</span>}
            </div>
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
                // Only surface a per-run span when it differs from the band
                // window — otherwise it's just noise repeated down the list.
                const runRange =
                  onViewLabel && formatShortRange(run.startDate, runEnd) !== onViewLabel
                    ? formatShortRange(run.startDate, runEnd)
                    : undefined
                return (
                  <li
                    key={run.key}
                    className={`${styles.run} ${status === 'past' ? styles.isPast : ''} ${
                      status === 'now' ? styles.isNow : ''
                    }`}
                  >
                    <div className={styles.runBody}>
                      <TypeChips event={run} />
                      <h4 className={styles.runName}>{run.name}</h4>
                      <VenueLine venue={run.venue} />
                    </div>
                    <div className={styles.runAside}>
                      {status === 'now' && <span className={styles.runNow}>On view now</span>}
                      {runRange && <span className={styles.runRange}>{runRange}</span>}
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
                <li className={`${styles.day} ${live && day.iso < todayIso! ? styles.isPast : ''}`}>
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
                      <EventRow key={event.key} event={event} />
                    ))}
                  </ul>
                </li>
              </Fragment>
            ))}
            {nowIndex === days.length && NowMarker}
          </ol>
        )}
      </div>
    </section>
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
      {venue.partOf && <span className={styles.venueParent}>{venue.partOf}</span>}
    </p>
  )
}

function EventRow({ event }: { event: CalendarEvent }) {
  const hasLinks = Boolean(event.ticketUrl || event.facebookUrl)
  return (
    <li className={`${styles.event} ${event.image ? styles.hasPoster : ''}`}>
      <div className={styles.eventBody}>
        <div className={styles.eventTop}>
          {event.startTime && <span className={styles.eventTime}>{event.startTime}</span>}
          <TypeChips event={event} />
          {event.image && <span className={styles.posterTag}>Poster</span>}
        </div>
        <h4 className={styles.eventName}>{event.name}</h4>
        <VenueLine venue={event.venue} />
        <p className={styles.eventDesc}>{event.description}</p>
        {hasLinks && (
          <div className={styles.eventLinks}>
            {event.ticketUrl && (
              <a
                className={styles.eventLink}
                href={event.ticketUrl}
                target="_blank"
                rel="noreferrer"
              >
                Tickets <RiArrowRightUpLine size={14} aria-hidden />
              </a>
            )}
            {event.facebookUrl && (
              <a
                className={styles.eventLink}
                href={event.facebookUrl}
                target="_blank"
                rel="noreferrer"
              >
                Facebook event <RiArrowRightUpLine size={14} aria-hidden />
              </a>
            )}
          </div>
        )}
      </div>
      {event.image && (
        <div className={styles.poster}>
          <Figure image={event.image} sizes="(min-width: 1280px) 240px, 70vw" />
        </div>
      )}
    </li>
  )
}
