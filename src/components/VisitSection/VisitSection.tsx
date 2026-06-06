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
import { MagneticButton } from '@/components/MagneticButton/MagneticButton'
import shared from '@/components/Shared.module.css'
import { PLACEHOLDER_IMAGE } from '@/lib/placeholder'
import type { IconKey, VisitData } from '@/types/edition'
import styles from './VisitSection.module.css'

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
  { top: '-12px', left: '60px', size: 24, color: 'var(--action)' },
  { top: '40px', right: '-16px', size: 20, color: 'var(--action)' },
  { bottom: '80px', right: '-20px', size: 16, color: 'var(--highlight)' },
  { bottom: '-14px', left: '120px', size: 22, color: 'var(--action)' },
  { top: '50%', left: '-18px', size: 14, color: 'var(--highlight)' },
  { bottom: '30px', left: '-10px', size: 18, color: 'var(--action)' },
  { top: '20px', left: '30%', size: 10, color: 'var(--highlight)' },
  { bottom: '-8px', right: '25%', size: 12, color: 'var(--highlight)' },
] as const

export function VisitSection(props: VisitData = {}) {
  const venueName = props.venueName ?? []
  const street = props.street ?? ''
  const city = props.city ?? ''
  const mapsUrl = props.mapsUrl ?? ''
  const image = props.image ?? PLACEHOLDER_IMAGE
  const hoursLines = props.hoursLines ?? []
  const amenities = props.amenities ?? []
  const transport = props.transport ?? []

  return (
    <div id="visit" className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.splitLayout}>
          <div className={styles.imageBlock}>
            <div className={styles.imageFrame}>
              <Figure
                image={image}
                sizes="(max-width: 1023px) 100vw, 45vw"
                className={styles.image}
              />
            </div>
            {PIXELS.map((px) => (
              <div
                key={`${px.size}-${px.color}-${'top' in px ? px.top : ''}${'bottom' in px ? px.bottom : ''}`}
                className={styles.pixel}
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

          <div className={styles.content}>
            <h2 className={shared.sectionTitle}>
              {venueName.map((line, i, arr) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: positional
                <span key={i}>
                  {line}
                  {i < arr.length - 1 && <br />}
                </span>
              ))}
            </h2>

            <div className={styles.infoRow}>
              <div className={styles.infoBlock}>
                <RiMapPinLine size={18} className={styles.infoIcon} />
                <span className={styles.infoLabel}>Location</span>
                <span className={styles.infoValue}>
                  {street}
                  <br />
                  {city}
                </span>
              </div>
              <div className={styles.infoBlock}>
                <RiTimeLine size={18} className={styles.infoIcon} />
                <span className={styles.infoLabel}>Opening Hours</span>
                <span className={styles.infoValue}>
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

            <div className={styles.practicalStrip}>
              {amenities.map((item) => {
                const Icon = ICONS[item.icon] ?? RiMapPinLine
                return (
                  <div key={item.label} className={styles.practicalItem}>
                    <Icon size={16} className={styles.practicalIcon} />
                    <span>{item.label}</span>
                  </div>
                )
              })}
            </div>

            <div className={styles.transportList}>
              {transport.map((route) => (
                <div key={route.from} className={styles.transportLine}>
                  <RiBusLine size={14} className={styles.transportIcon} />
                  <span className={styles.transportFrom}>{route.from}</span>
                  <span className={styles.transportDot}>&middot;</span>
                  <span>{route.lines}</span>
                  <span className={styles.transportDot}>&middot;</span>
                  <span className={styles.transportWalk}>{route.walk}</span>
                </div>
              ))}
            </div>

            <div className={styles.cta}>
              <MagneticButton
                href={mapsUrl}
                external
                variant="secondary"
                color="var(--action)"
                textColor="var(--action)"
              >
                <RiMapPinLine size={16} />
                Get Directions
              </MagneticButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
