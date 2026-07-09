import { RiMapPinLine } from '@remixicon/react'
import Link from 'next/link'
import { cx } from 'styled-system/css'
import { Container, Stack, Wrap } from 'styled-system/jsx'
import { section } from 'styled-system/recipes'
import { Accordion } from '@/components/ui/Accordion/Accordion'
import { Badge } from '@/components/ui/Badge/Badge'
import { Button } from '@/components/ui/Button/Button'
import { SectionHeading } from '@/components/ui/SectionHeading/SectionHeading'
import { slugify } from '@/lib/slugify'
import type { TopVenue, VenueEvent, VenueNode, VenueTypeSection } from '@/lib/venues'
import { venuesView } from './VenuesView.recipe'

const styles = venuesView()

// The Visit edition's programme browsed by place (ZSB-27), on the Visit page
// below the main-venue block. The edition shown is the one the Visit switch
// resolves to (latest|upcoming, ZSB-46). Venues that have events, grouped by
// type, with sub-venues rolled up under their parent — the sections are built in
// the data layer (ZSB-65), so this is a pure renderer. Each venue is an item in
// the shared Accordion; event names deep-link to the edition calendar's detail
// modal (reusing ZSB-40).
export function VenuesView({ year, sections }: { year: number; sections: VenueTypeSection[] }) {
  return (
    <section className={cx(section(), styles.section)} aria-labelledby="venues-heading">
      <Container>
        <header className={styles.header}>
          <SectionHeading id="venues-heading" flush>
            Where it happens
          </SectionHeading>
          <p className={styles.lede}>The {year} programme, venue by venue.</p>
        </header>

        {sections.map((section) => (
          <div key={section.type} className={styles.group}>
            <h3 className={styles.groupTitle}>{section.type}</h3>
            <Accordion
              id={`venues-${slugify(section.type)}`}
              className={styles.venues}
              triggerTypography="display"
              items={section.venues.map((venue) => ({
                id: slugify(venue.name),
                trigger: venue.name,
                triggerHeading: 'h4',
                meta: `${venue.totalEvents} ${venue.totalEvents === 1 ? 'event' : 'events'}`,
                content: <VenueDetails venue={venue} year={year} />,
              }))}
            />
          </div>
        ))}
      </Container>
    </section>
  )
}

function VenueDetails({ venue, year }: { venue: TopVenue; year: number }) {
  return (
    <>
      <VenuePlace venue={venue} />
      {venue.events.length > 0 && <EventList events={venue.events} year={year} />}

      {venue.children.map((child) => (
        <Stack key={child.name} className={styles.child} gap="sm">
          <Wrap as="p" align="baseline">
            <span className={styles.childName}>{child.name}</span>
            <span className={styles.childType}>{child.type}</span>
          </Wrap>
          <VenuePlace venue={child} />
          <EventList events={child.events} year={year} />
        </Stack>
      ))}
    </>
  )
}

// Address + map link, when authored. Often empty for now (no venue has an
// address yet), so it self-hides.
function VenuePlace({ venue }: { venue: VenueNode }) {
  if (!venue.address && !venue.mapUrl) return null
  return (
    <Wrap as="p" className={styles.place} gap="md">
      {venue.address && <span>{venue.address}</span>}
      {venue.mapUrl && (
        <Button asChild variant="link">
          <a href={venue.mapUrl} target="_blank" rel="noreferrer">
            <RiMapPinLine size={14} aria-hidden /> Map
          </a>
        </Button>
      )}
    </Wrap>
  )
}

function EventList({ events, year }: { events: VenueEvent[]; year: number }) {
  return (
    <ul className={styles.events}>
      {events.map((event) => (
        <Stack as="li" key={event.key} className={styles.event} gap="sm">
          <Link className={styles.eventName} href={`/editions/${year}/events/${event.slug}`}>
            {event.name}
          </Link>
          <span className={styles.eventWhen}>{event.when}</span>
          {event.types.length > 0 && (
            <Wrap as="ul" listStyle="none">
              {event.types.map((t) => (
                <li key={t.slug}>
                  <Badge tone="outline">{t.title}</Badge>
                </li>
              ))}
            </Wrap>
          )}
        </Stack>
      ))}
    </ul>
  )
}
