import {
  type RemixiconComponentType,
  RiArrowRightUpLine,
  RiCupLine,
  RiHomeWifiLine,
  RiPaintBrushLine,
  RiParkingBoxLine,
  RiTempColdLine,
  RiWheelchairLine,
} from '@remixicon/react'
import {
  transportList,
  visitFacts,
  visitImageFrame,
} from '@site/visit/_components/VisitSection.recipe'
import { css } from 'styled-system/css'
import { Container, Grid, HStack, Stack, Text, Wrap } from 'styled-system/jsx'
import { section } from 'styled-system/recipes'
import { Figure } from '@/components/Figure/Figure'
import { Button } from '@/components/ui/Button/Button'
import { SectionHeading } from '@/components/ui/SectionHeading/SectionHeading'
import type { Amenity, IconKey, TransportRoute, VisitData } from '@/types/edition'

// Fixed icon set mirrored from the amenity schema. Editors pick an
// icon key; this is the renderer-side mapping.
const ICONS: Record<IconKey, RemixiconComponentType> = {
  wheelchair: RiWheelchairLine,
  parking: RiParkingBoxLine,
  cafe: RiCupLine,
  paint: RiPaintBrushLine,
  restroom: RiTempColdLine,
  wifi: RiHomeWifiLine,
}

export function VisitSection({
  venueName,
  street,
  city,
  mapsUrl,
  image,
  hoursLines,
  amenities,
  transport,
}: VisitData) {
  const frame = visitImageFrame()
  const facts = visitFacts()

  return (
    <section id="visit" className={section({ ground: 'dark' })}>
      <Container>
        <Grid
          gridTemplateColumns={{ lg: '5fr 6fr' }}
          gap={{ base: '2xl', lg: 'gridGap' }}
          alignItems="start"
        >
          <div className={frame.block}>
            <div className={frame.frame}>
              <Figure
                image={image}
                sizes="(max-width: 1023px) min(100vw, 520px), 45vw"
                className={frame.image}
              />
            </div>
          </div>

          <Stack gap="xl">
            <SectionHeading flush className={css({ whiteSpace: 'pre-line' })}>
              {venueName.join('\n')}
            </SectionHeading>

            <Stack className={facts.group} gap="lg">
              <div className={facts.pair}>
                <Stack gap="xs">
                  <Text variant="label">Location</Text>
                  <Text variant="body" className={facts.value}>
                    {street}
                    <br />
                    {city}
                  </Text>
                </Stack>
                <Stack gap="xs">
                  <Text variant="label">Opening hours</Text>
                  <Text variant="body" className={facts.value}>
                    {hoursLines.join('\n')}
                  </Text>
                </Stack>
              </div>

              {mapsUrl ? (
                <div>
                  <Button asChild variant="primary">
                    <a href={mapsUrl} target="_blank" rel="noopener noreferrer">
                      Get directions <RiArrowRightUpLine size={14} />
                    </a>
                  </Button>
                </div>
              ) : null}
            </Stack>

            {transport.length > 0 && (
              <Stack className={facts.group} gap="sm">
                <Text variant="label">Getting here</Text>
                <TransportRoutes routes={transport} />
              </Stack>
            )}

            {amenities.length > 0 && (
              <Stack className={facts.group} gap="sm">
                <Text variant="label">On site</Text>
                <Amenities items={amenities} />
              </Stack>
            )}
          </Stack>
        </Grid>
      </Container>
    </section>
  )
}

function TransportRoutes({ routes }: { routes: TransportRoute[] }) {
  const styles = transportList()
  return (
    <ul className={styles.list}>
      {routes.map((route) => (
        <li key={route.from} className={styles.row}>
          <Text variant="body" className={styles.from}>
            {route.from}
          </Text>
          <Text variant="caption" className={styles.lines}>
            {route.lines}
          </Text>
          <Text variant="caption" className={styles.walk}>
            {route.walk}
          </Text>
        </li>
      ))}
    </ul>
  )
}

function Amenities({ items }: { items: Amenity[] }) {
  return (
    <Wrap as="ul" listStyle="none" rowGap="md" columnGap="lg">
      {items.map((item) => {
        const Icon = ICONS[item.icon]
        return (
          <HStack as="li" key={item.label} gap="sm">
            <Icon size={16} aria-hidden />
            <Text variant="caption">{item.label}</Text>
          </HStack>
        )
      })}
    </Wrap>
  )
}
