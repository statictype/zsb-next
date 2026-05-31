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
import Image from 'next/image'
import { MagneticButton } from '@/components/MagneticButton/MagneticButton'
import shared from '@/components/Shared.module.css'
import { blobUrl } from '@/lib/blob'
import type { ImageData } from '@/types/edition'
import styles from './VisitSection.module.css'

// Fallback values for when the visitPage singleton hasn't been published.
const FALLBACK_VENUE_NAME = ['COMBINATUL', 'FONDULUI', 'PLASTIC']
const FALLBACK_STREET = 'Str. Băiculești 29'
const FALLBACK_CITY = 'Sector 1, București'
const FALLBACK_MAPS_URL =
  'https://maps.google.com/?q=Combinatul+Fondului+Plastic+Bucuresti'
const FALLBACK_IMAGE: ImageData = {
  src: blobUrl('2023/od6-0441.jpg'),
  alt: 'Combinatul Fondului Plastic venue interior during ZSB',
}
const FALLBACK_HOURS = ['Daily 11:00 — 20:00', 'Free Entry']
const FALLBACK_AMENITIES: Amenity[] = [
  { label: 'Accessible', icon: 'wheelchair' },
  { label: 'Free Parking', icon: 'parking' },
  { label: 'On-site Café', icon: 'cafe' },
  { label: 'Kids Workshops', icon: 'paint' },
]
const FALLBACK_TRANSPORT: TransportRoute[] = [
  { from: 'Gara de Nord', lines: 'Bus 205 / Tram 45', walk: '5 min walk' },
  { from: 'Piața Presei', lines: 'Bus 301 / Bus 331', walk: '3 min walk' },
  { from: 'Piața Unirii', lines: 'Bus 205 / Tram 45', walk: '5 min walk' },
]

type IconKey = 'wheelchair' | 'parking' | 'cafe' | 'paint' | 'restroom' | 'wifi'

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

export interface Amenity {
  label: string
  icon: IconKey
}

export interface TransportRoute {
  from: string
  lines: string
  walk: string
}

export interface VisitSectionProps {
  venueName?: string[] | null
  street?: string | null
  city?: string | null
  mapsUrl?: string | null
  image?: ImageData | null
  hoursLines?: string[] | null
  amenities?: Amenity[] | null
  transport?: TransportRoute[] | null
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

export function VisitSection(props: VisitSectionProps = {}) {
  const venueName = props.venueName?.length ? props.venueName : FALLBACK_VENUE_NAME
  const street = props.street ?? FALLBACK_STREET
  const city = props.city ?? FALLBACK_CITY
  const mapsUrl = props.mapsUrl ?? FALLBACK_MAPS_URL
  const image = props.image ?? FALLBACK_IMAGE
  const hoursLines = props.hoursLines?.length ? props.hoursLines : FALLBACK_HOURS
  const amenities = props.amenities?.length ? props.amenities : FALLBACK_AMENITIES
  const transport = props.transport?.length ? props.transport : FALLBACK_TRANSPORT

  return (
    <div id="visit" className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.splitLayout}>
          <div className={styles.imageBlock}>
            <div className={styles.imageFrame}>
              <span aria-hidden className={shared.skeleton} />
              <Image
                src={image.src}
                alt={image.alt}
                fill
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
