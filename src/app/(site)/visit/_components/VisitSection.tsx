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
import { visitSection } from './VisitSection.recipe'

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

  return (
    <div id="visit" className={s.section}>
      <div className={s.inner}>
        <div className={s.splitLayout}>
          <div className={s.imageBlock}>
            <div className={s.imageFrame}>
              <Figure image={image} sizes="(max-width: 1023px) 100vw, 45vw" className={s.image} />
            </div>
          </div>

          <div className={s.content}>
            <SectionHeading flush className={css({ whiteSpace: 'pre-line' })}>
              {venueName.join('\n')}
            </SectionHeading>

            <div className={s.infoRow}>
              <div className={s.infoBlock}>
                <RiMapPinLine size={18} className={s.infoIcon} />
                <span className={s.infoLabel}>Location</span>
                <span className={s.infoValue}>
                  {street}
                  <br />
                  {city}
                </span>
              </div>
              <div className={s.infoBlock}>
                <RiTimeLine size={18} className={s.infoIcon} />
                <span className={s.infoLabel}>Opening Hours</span>
                <span className={s.infoValue}>{hoursLines.join('\n')}</span>
              </div>
            </div>

            <div className={s.practicalStrip}>
              {amenities.map((item) => {
                const Icon = ICONS[item.icon] ?? RiMapPinLine
                return (
                  <div key={item.label} className={s.practicalItem}>
                    <Icon size={16} className={s.practicalIcon} />
                    <span>{item.label}</span>
                  </div>
                )
              })}
            </div>

            <div className={s.transportList}>
              {transport.map((route) => (
                <div key={route.from} className={s.transportLine}>
                  <RiBusLine size={14} className={s.transportIcon} />
                  <span className={s.transportFrom}>{route.from}</span>
                  <span className={s.transportDot}>&middot;</span>
                  <span>{route.lines}</span>
                  <span className={s.transportDot}>&middot;</span>
                  <span className={s.transportWalk}>{route.walk}</span>
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
