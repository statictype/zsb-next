import Link from 'next/link'
import type { CSSProperties } from 'react'
import { css, cx } from 'styled-system/css'
import { Container } from 'styled-system/jsx'
import { section } from 'styled-system/recipes'
import { Figure } from '@/components/Figure/Figure'
import { Badge } from '@/components/ui/Badge/Badge'
import { Button } from '@/components/ui/Button/Button'
import { Card } from '@/components/ui/Card/Card'
import { Eyebrow } from '@/components/ui/Eyebrow/Eyebrow'
import { SectionHeading } from '@/components/ui/SectionHeading/SectionHeading'
import { dayToken, eventWhenLabelShort } from '@/lib/edition-dates'
import type { CalendarEvent } from '@/types/edition'
import { featuredEvents } from './FeaturedEvents.recipe'

const styles = featuredEvents()

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
    <section className={section({ ground: 'dark' })} aria-labelledby="featured-heading">
      <Container>
        <header className={styles.header}>
          <div className={styles.headerMain}>
            <Eyebrow className={styles.eyebrow}>Don&rsquo;t miss</Eyebrow>
            <SectionHeading id="featured-heading" flush>
              Featured
            </SectionHeading>
          </div>
          <Button asChild variant="link">
            <Link href={`/editions/${year}#program`}>Full calendar</Link>
          </Button>
        </header>

        <ul className={styles.grid}>
          {events.map((event, i) => (
            <FeaturedCard key={event.key} event={event} year={year} index={i} />
          ))}
        </ul>
      </Container>
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
    <li
      className={cx(styles.card, css({ animationStyle: 'enter' }))}
      style={{ '--i': index } as CSSProperties}
    >
      <Card
        as="article"
        ground="onDark"
        interactive
        className={cx(styles.frame, !event.image && styles.noPoster)}
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
                <li key={t.slug}>
                  <Badge>{t.title}</Badge>
                </li>
              ))}
            </ul>
          )}
        </div>
      </Card>
    </li>
  )
}
