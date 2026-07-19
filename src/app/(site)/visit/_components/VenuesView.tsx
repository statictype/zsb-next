import { RiMapPinLine } from '@remixicon/react'
import Link from 'next/link'
import { Container, Divider, Stack, Text, Wrap } from 'styled-system/jsx'
import { section } from 'styled-system/recipes'
import { venuesView } from '@/app/(site)/visit/_components/VenuesView.recipe'
import { Accordion } from '@/components/ui/Accordion/Accordion'
import { Badge } from '@/components/ui/Badge/Badge'
import { Button } from '@/components/ui/Button/Button'
import { SectionHeading } from '@/components/ui/SectionHeading/SectionHeading'
import { slugify } from '@/lib/slugify'
import type { TopVenue, VenueEvent, VenueNode, VenueTypeSection } from '@/lib/venues'

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
    <>
      <Divider />
      <section className={section()} aria-labelledby="venues-heading">
        <Container>
          <Stack gap="xl">
            <Stack as="header" gap="md">
              <SectionHeading id="venues-heading" flush>
                Where it happens
              </SectionHeading>
              <Text as="p" variant="caption">
                The {year} programme, venue by venue.
              </Text>
            </Stack>

            <Stack gap="2xl">
              {sections.map((section) => (
                <Stack key={section.type} gap="sm">
                  <Text as="h3" variant="caption" className={styles.groupTitle}>
                    {section.type}
                  </Text>
                  <Divider />
                  <Accordion
                    id={`venues-${slugify(section.type)}`}
                    className={styles.venues}
                    items={section.venues.map((venue) => ({
                      id: slugify(venue.name),
                      trigger: venue.name,
                      triggerHeading: 'h4',
                      meta: `${venue.totalEvents} ${venue.totalEvents === 1 ? 'event' : 'events'}`,
                      content: <VenueDetails venue={venue} year={year} />,
                    }))}
                  />
                </Stack>
              ))}
            </Stack>
          </Stack>
        </Container>
      </section>
    </>
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
            <Text variant="caption" className={styles.childName}>
              {child.name}
            </Text>
            <Text variant="label">{child.type}</Text>
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
    <Wrap as="p" gap="md">
      {venue.address && <Text variant="caption">{venue.address}</Text>}
      {venue.mapUrl && (
        <Button asChild variant="link">
          <a href={venue.mapUrl} target="_blank" rel="noreferrer">
            <Text variant="caption" display="contents">
              <RiMapPinLine size={14} aria-hidden /> Map
            </Text>
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
            <Text variant="heading" display="contents">
              {event.name}
            </Text>
          </Link>
          <Text variant="label" className={styles.eventWhen}>
            {event.when}
          </Text>
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
