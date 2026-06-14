import { RiArrowRightLine } from '@remixicon/react'
import Link from 'next/link'
import type { CSSProperties } from 'react'
import { Figure } from '@/components/Figure/Figure'
import { Card } from '@/components/ui/Card/Card'
import { dayToken, eventWhenLabelShort } from '@/lib/edition-dates'
import type { CalendarEvent } from '@/types/edition'
import styles from './FeaturedEvents.module.css'

// The homepage spotlight (ZSB-31): the few events the team has marked `featured`,
// pulled off the schedule board (ZSB-28) and pinned up as poster cards. The look
// only — which edition these come from and whether the section appears at all is
// owned by ZSB-44; this component takes the chosen events and renders them. Each
// card links to the event's route so the detail modal opens over the edition
// (ADR 0015), exactly like a calendar row.

interface FeaturedEventsProps {
  year: number
  events: CalendarEvent[]
}

export function FeaturedEvents({ year, events }: FeaturedEventsProps) {
  // No marked events → no section. (Presence is ultimately ZSB-44's call, but a
  // component that renders an empty spotlight would be a bug regardless.)
  if (events.length === 0) return null

  return (
    <section className={styles.section} aria-labelledby="featured-heading">
      <div className={styles.inner}>
        <header className={styles.header}>
          <div className={styles.headerMain}>
            <p className={styles.eyebrow}>Don&rsquo;t miss</p>
            <h2 id="featured-heading" className={styles.title}>
              Featured
            </h2>
          </div>
          <Link className={styles.calendarLink} href={`/editions/${year}#program`}>
            Full calendar <RiArrowRightLine size={15} aria-hidden />
          </Link>
        </header>

        <ul className={styles.grid}>
          {events.map((event, i) => (
            <FeaturedCard key={event.key} event={event} year={year} index={i} />
          ))}
        </ul>
      </div>
    </section>
  )
}

function FeaturedCard({
  event,
  year,
  index,
}: {
  event: CalendarEvent
  year: number
  index: number
}) {
  const token = dayToken(event.startDate)
  const stamp = String(index + 1).padStart(2, '0')

  return (
    // The stagger delay rides --i; the whole frame is the hit target via the
    // name link's stretched ::after (see .cardLink in the CSS).
    <li className={styles.card} style={{ '--i': index } as CSSProperties}>
      <Card
        as="article"
        ground="onDark"
        interactive
        className={`${styles.frame} ${event.image ? styles.hasPoster : styles.noPoster}`}
      >
        {event.image ? (
          <Figure
            image={event.image}
            sizes="(min-width: 1024px) 30vw, (min-width: 768px) 46vw, 92vw"
          />
        ) : (
          token && (
            <span className={styles.watermark} aria-hidden>
              {token.dayPadded}
            </span>
          )
        )}

        <span className={styles.scrim} aria-hidden />
        <span className={styles.stamp} aria-hidden>
          {stamp}
        </span>

        <div className={styles.caption}>
          <p className={styles.when}>{eventWhenLabelShort(event)}</p>
          <h3 className={styles.name}>
            <Link className={styles.cardLink} href={`/editions/${year}/events/${event.slug}`}>
              {event.name}
            </Link>
          </h3>
          <p className={styles.venue}>
            <span className={styles.venueName}>{event.venue.name}</span>
            {event.venue.partOf && (
              <span className={styles.venueParent}>{event.venue.partOf.name}</span>
            )}
          </p>
          {event.types.length > 0 && (
            <ul className={styles.chips}>
              {event.types.slice(0, 2).map((t) => (
                <li key={t.slug} className={styles.chip}>
                  {t.title}
                </li>
              ))}
            </ul>
          )}
        </div>
      </Card>
    </li>
  )
}
