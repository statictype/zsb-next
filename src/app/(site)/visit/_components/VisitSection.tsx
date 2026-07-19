import {
  type RemixiconComponentType,
  RiBusLine,
  RiCupLine,
  RiHomeWifiLine,
  RiMapPinLine,
  RiPaintBrushLine,
  RiParkingBoxLine,
  RiTempColdLine,
  RiTimeLine,
  RiWheelchairLine,
} from '@remixicon/react'
import {
  transportList as transportListRecipe,
  visitImageFrame,
  visitInfoSummary,
  visitSection,
} from '@site/visit/_components/VisitSection.recipe'
import { css } from 'styled-system/css'
import { Container, Divider, Grid, HStack, Stack, Text, Wrap } from 'styled-system/jsx'
import { Figure } from '@/components/Figure/Figure'
import { Button } from '@/components/ui/Button/Button'
import { SectionHeading } from '@/components/ui/SectionHeading/SectionHeading'
import type { IconKey, VisitData } from '@/types/edition'

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

export function VisitSection(props: VisitData = {}) {
  const venueName = props.venueName ?? []
  const street = props.street ?? ''
  const city = props.city ?? ''
  const mapsUrl = props.mapsUrl ?? ''
  const image = props.image
  const hoursLines = props.hoursLines ?? []
  const amenities = props.amenities ?? []
  const transport = props.transport ?? []

  const s = visitSection()
  const imageStyles = visitImageFrame()
  const infoStyles = visitInfoSummary()
  const transportStyles = transportListRecipe()

  return (
    <div id="visit" className={s.section}>
      <Container>
        <Grid
          gridTemplateColumns={{ lg: '5fr 6fr' }}
          gap={{ base: '2xl', lg: 'gridGap' }}
          alignItems="center"
        >
          <div className={imageStyles.block}>
            <div className={imageStyles.frame}>
              <Figure
                image={image}
                sizes="(max-width: 1023px) 100vw, 45vw"
                className={imageStyles.image}
              />
            </div>
          </div>

          <Stack className={s.content} gap="lg">
            <SectionHeading flush className={css({ whiteSpace: 'pre-line' })}>
              {venueName.join('\n')}
            </SectionHeading>

            <div className={infoStyles.row}>
              <Stack gap="xs">
                <RiMapPinLine size={18} className={infoStyles.icon} />
                <Text variant="label">Location</Text>
                <Text variant="caption" className={infoStyles.value}>
                  {street}
                  <br />
                  {city}
                </Text>
              </Stack>
              <Stack gap="xs">
                <RiTimeLine size={18} className={infoStyles.icon} />
                <Text variant="label">Opening Hours</Text>
                <Text variant="caption" className={infoStyles.value}>
                  {hoursLines.join('\n')}
                </Text>
              </Stack>
            </div>

            <Stack gap="sm">
              <Divider />
              <Wrap gap="md">
                {amenities.map((item) => {
                  const Icon = ICONS[item.icon] ?? RiMapPinLine
                  return (
                    <HStack key={item.label}>
                      <Icon size={16} />
                      <Text variant="label">{item.label}</Text>
                    </HStack>
                  )
                })}
              </Wrap>
            </Stack>

            <Stack gap="sm">
              {transport.map((route) => (
                <HStack key={route.from} flexWrap="wrap">
                  <RiBusLine size={14} className={transportStyles.icon} />
                  <Text variant="body" className={transportStyles.from}>
                    {route.from}
                  </Text>
                  <Text variant="caption">&middot;</Text>
                  <Text variant="caption">{route.lines}</Text>
                  <Text variant="caption">&middot;</Text>
                  <Text variant="caption">{route.walk}</Text>
                </HStack>
              ))}
            </Stack>

            {mapsUrl ? (
              <div>
                <Button asChild variant="link">
                  <a href={mapsUrl} target="_blank" rel="noopener noreferrer">
                    <RiMapPinLine size={16} />
                    Get Directions
                  </a>
                </Button>
              </div>
            ) : null}
          </Stack>
        </Grid>
      </Container>
    </div>
  )
}
