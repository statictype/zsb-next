import {
  RiBusLine,
  RiCupLine,
  RiMapPinLine,
  RiPaintBrushLine,
  RiParkingBoxLine,
  RiTimeLine,
  RiWheelchairLine,
} from '@remixicon/react'
import Image from 'next/image'
import { MagneticButton } from '@/components/MagneticButton/MagneticButton'
import { imageSrc } from '@/lib/image-utils'
import type { ImageData } from '@/types/edition'
import styles from './VisitSection.module.css'

const venueImage: ImageData = {
  basePath: '/img/2023/optimized/OD6-0441',
  alt: 'Combinatul Fondului Plastic venue interior during ZSB',
}

const VENUE = {
  name: 'Combinatul Fondului Plastic',
  street: 'Str. Băiculești 29',
  city: 'Sector 1, București',
  mapsUrl: 'https://maps.google.com/?q=Combinatul+Fondului+Plastic+Bucuresti',
}

const PIXELS = [
  { top: '-12px', left: '60px', size: 24, color: 'var(--pink)' },
  { top: '40px', right: '-16px', size: 20, color: 'var(--pink)' },
  { bottom: '80px', right: '-20px', size: 16, color: 'var(--chartreuse)' },
  { bottom: '-14px', left: '120px', size: 22, color: 'var(--pink)' },
  { top: '50%', left: '-18px', size: 14, color: 'var(--chartreuse)' },
  { bottom: '30px', left: '-10px', size: 18, color: 'var(--pink)' },
  { top: '20px', left: '30%', size: 10, color: 'var(--chartreuse)' },
  { bottom: '-8px', right: '25%', size: 12, color: 'var(--chartreuse)' },
] as const

const TRANSPORT = [
  { from: 'Gara de Nord', lines: 'Bus 205 / Tram 45', walk: '5 min walk' },
  { from: 'Piața Presei', lines: 'Bus 301 / Bus 331', walk: '3 min walk' },
  { from: 'Piața Unirii', lines: 'Bus 205 / Tram 45', walk: '5 min walk' },
] as const

const PRACTICAL = [
  { icon: RiWheelchairLine, label: 'Accessible' },
  { icon: RiParkingBoxLine, label: 'Free Parking' },
  { icon: RiCupLine, label: 'On-site Café' },
  { icon: RiPaintBrushLine, label: 'Kids Workshops' },
] as const

export function VisitSection() {
  return (
    <div id="visit" className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.splitLayout}>
          {/* ---- Image with pixel decorations ---- */}
          <div className={styles.imageBlock}>
            <div className={styles.imageFrame}>
              <Image
                src={imageSrc(venueImage)}
                alt={venueImage.alt}
                fill
                sizes="(max-width: 1023px) 100vw, 45vw"
                className={styles.image}
              />
            </div>
            {PIXELS.map((px, i) => (
              <div
                key={i}
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

          {/* ---- Content ---- */}
          <div className={styles.content}>
            <span className={styles.eyebrow}>Visit ZSB</span>
            <h2 className={styles.headline}>
              COMBINATUL
              <br />
              FONDULUI
              <br />
              PLASTIC
            </h2>

            <div className={styles.infoRow}>
              <div className={styles.infoBlock}>
                <RiMapPinLine size={18} className={styles.infoIcon} />
                <span className={styles.infoLabel}>Location</span>
                <span className={styles.infoValue}>
                  {VENUE.street}
                  <br />
                  {VENUE.city}
                </span>
              </div>
              <div className={styles.infoBlock}>
                <RiTimeLine size={18} className={styles.infoIcon} />
                <span className={styles.infoLabel}>Opening Hours</span>
                <span className={styles.infoValue}>
                  Daily 11:00 — 20:00
                  <br />
                  Free Entry
                </span>
              </div>
            </div>

            <div className={styles.practicalStrip}>
              {PRACTICAL.map((item) => (
                <div key={item.label} className={styles.practicalItem}>
                  <item.icon size={16} className={styles.practicalIcon} />
                  <span>{item.label}</span>
                </div>
              ))}
            </div>

            <div className={styles.transportList}>
              {TRANSPORT.map((route) => (
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
                href={VENUE.mapsUrl}
                external
                variant="secondary"
                color="var(--pink)"
                textColor="var(--pink)"
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
