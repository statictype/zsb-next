import Link from 'next/link'
import type { CSSProperties } from 'react'
import { css, cx } from 'styled-system/css'
import { Container, Grid, HStack, Text, Wrap } from 'styled-system/jsx'
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

interface FeaturedEventsProps {
  year: number
  events: CalendarEvent[]
}

export function FeaturedEvents({ year, events }: FeaturedEventsProps) {
  if (events.length === 0) return null

  return (
    <section className={section({ ground: 'dark' })} aria-labelledby="featured-heading">
      <Container>
        <HStack
          as="header"
          className={styles.header}
          alignItems="flex-end"
          justify="space-between"
          gap="md"
        >
          <div className={styles.headerMain}>
            <Eyebrow className={styles.eyebrow}>Don&rsquo;t miss</Eyebrow>
            <SectionHeading id="featured-heading" flush>
              Featured
            </SectionHeading>
          </div>
          <Button asChild variant="link">
            <Link href={`/editions/${year}#program`}>Full calendar</Link>
          </Button>
        </HStack>

        <Grid as="ul" columns={{ base: 1, md: 2, lg: 3 }} listStyle="none">
          {events.map((event, i) => (
            <FeaturedCard key={event.key} event={event} year={year} index={i} />
          ))}
        </Grid>
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
          <Text as="p" variant="label" className={styles.when}>
            {eventWhenLabelShort(event)}
          </Text>
          <h3 className={styles.name}>
            <Link className={styles.cardLink} href={`/editions/${year}/events/${event.slug}`}>
              {event.name}
            </Link>
          </h3>
          <Wrap as="p" className={styles.venue}>
            <Text variant="caption" className={styles.venueName}>
              {event.venue.name}
            </Text>
            {event.venue.partOf && (
              <Text variant="label" className={styles.venueParent}>
                {event.venue.partOf.name}
              </Text>
            )}
          </Wrap>
          {event.types.length > 0 && (
            <Wrap as="ul" listStyle="none" marginTop="xs">
              {event.types.slice(0, 2).map((t) => (
                <li key={t.slug}>
                  <Badge>{t.title}</Badge>
                </li>
              ))}
            </Wrap>
          )}
        </div>
      </Card>
    </li>
  )
}
