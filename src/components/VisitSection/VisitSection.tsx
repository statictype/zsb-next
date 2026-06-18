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

const PIXELS = [
  { top: '-12px', left: '60px', size: 24, color: 'var(--colors-action)' },
  { top: '40px', right: '-16px', size: 20, color: 'var(--colors-action)' },
  { bottom: '80px', right: '-20px', size: 16, color: 'var(--colors-highlight)' },
  { bottom: '-14px', left: '120px', size: 22, color: 'var(--colors-action)' },
  { top: '50%', left: '-18px', size: 14, color: 'var(--colors-highlight)' },
  { bottom: '30px', left: '-10px', size: 18, color: 'var(--colors-action)' },
  { top: '20px', left: '30%', size: 10, color: 'var(--colors-highlight)' },
  { bottom: '-8px', right: '25%', size: 12, color: 'var(--colors-highlight)' },
] as const

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
            {PIXELS.map((px) => (
              <div
                key={`${px.size}-${px.color}-${'top' in px ? px.top : ''}${'bottom' in px ? px.bottom : ''}`}
                className={s.pixel}
                style={{
                  top: 'top' in px ? px.top : undefined,
                  bottom: 'bottom' in px ? px.bottom : undefined,
                  left: 'left' in px ? px.left : undefined,
                  right: 'right' in px ? px.right : undefined,
                  width: px.size,
                  height: px.size,
                  background: px.color,
                }}
              />
            ))}
          </div>

          <div className={s.content}>
            <SectionHeading flush>
              {venueName.map((line, i, arr) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: positional
                <span key={i}>
                  {line}
                  {i < arr.length - 1 && <br />}
                </span>
              ))}
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
                <span className={s.infoValue}>
                  {hoursLines.map((line, i, arr) => (
                    // biome-ignore lint/suspicious/noArrayIndexKey: positional
                    <span key={i}>
                      {line}
                      {i < arr.length - 1 && <br />}
                    </span>
                  ))}
                </span>
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
              <Button asChild variant="text">
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
