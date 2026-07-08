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
import { css } from 'styled-system/css'
import { Figure } from '@/components/Figure/Figure'
import { Button } from '@/components/ui/Button/Button'
import { SectionHeading } from '@/components/ui/SectionHeading/SectionHeading'
import type { IconKey, VisitData } from '@/types/edition'
import {
  amenityStrip,
  transportList as transportListRecipe,
  visitImageFrame,
  visitInfoSummary,
  visitSection,
} from './VisitSection.recipe'

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
  const amenityStyles = amenityStrip()
  const transportStyles = transportListRecipe()

  return (
    <div id="visit" className={s.section}>
      <div className={s.inner}>
        <div className={s.splitLayout}>
          <div className={imageStyles.block}>
            <div className={imageStyles.frame}>
              <Figure
                image={image}
                sizes="(max-width: 1023px) 100vw, 45vw"
                className={imageStyles.image}
              />
            </div>
          </div>

          <div className={s.content}>
            <SectionHeading flush className={css({ whiteSpace: 'pre-line' })}>
              {venueName.join('\n')}
            </SectionHeading>

            <div className={infoStyles.row}>
              <div className={infoStyles.block}>
                <RiMapPinLine size={18} className={infoStyles.icon} />
                <span className={infoStyles.label}>Location</span>
                <span className={infoStyles.value}>
                  {street}
                  <br />
                  {city}
                </span>
              </div>
              <div className={infoStyles.block}>
                <RiTimeLine size={18} className={infoStyles.icon} />
                <span className={infoStyles.label}>Opening Hours</span>
                <span className={infoStyles.value}>{hoursLines.join('\n')}</span>
              </div>
            </div>

            <div className={amenityStyles.strip}>
              {amenities.map((item) => {
                const Icon = ICONS[item.icon] ?? RiMapPinLine
                return (
                  <div key={item.label} className={amenityStyles.item}>
                    <Icon size={16} className={amenityStyles.icon} />
                    <span>{item.label}</span>
                  </div>
                )
              })}
            </div>

            <div className={transportStyles.list}>
              {transport.map((route) => (
                <div key={route.from} className={transportStyles.line}>
                  <RiBusLine size={14} className={transportStyles.icon} />
                  <span className={transportStyles.from}>{route.from}</span>
                  <span className={transportStyles.dot}>&middot;</span>
                  <span>{route.lines}</span>
                  <span className={transportStyles.dot}>&middot;</span>
                  <span className={transportStyles.walk}>{route.walk}</span>
                </div>
              ))}
            </div>

            <div className={s.cta}>
              <Button asChild variant="link">
                <a href={mapsUrl} target="_blank" rel="noopener noreferrer">
                  <RiMapPinLine size={16} />
                  Get Directions
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
