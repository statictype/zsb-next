import {
  RiBusLine,
  RiCalendarLine,
  RiCupLine,
  RiMapPinLine,
  RiPaintBrushLine,
  RiParkingBoxLine,
  RiTicketLine,
  RiTimeLine,
  RiWalkLine,
  RiWheelchairLine,
} from '@remixicon/react'
import type { Metadata } from 'next'
import Image from 'next/image'
import shared from '@/components/Shared.module.css'
import { imageSrc } from '@/lib/image-utils'
import type { ImageData } from '@/types/edition'
import styles from './page.module.css'

export const metadata: Metadata = {
  title: 'Visit',
  description:
    'Plan your visit to Bucharest Sculpture Days at Combinatul Fondului Plastic — directions, venue map, opening hours, and practical info.',
  alternates: { canonical: '/visit' },
}

// ---- Data Constants ----

const heroImage: ImageData = {
  basePath: '/img/2023/optimized/OD6-0441',
  alt: 'Combinatul Fondului Plastic venue interior during ZSB',
}

const QUICK_FACTS = [
  { label: 'Opening Hours', value: '11:00 — 20:00', icon: RiTimeLine },
  { label: 'Admission', value: 'Free Entry', icon: RiTicketLine },
  { label: 'Dates', value: 'Oct 3 — 12, 2025', icon: RiCalendarLine },
] as const

const MAP_LOCATIONS = [
  {
    type: 'gallery' as const,
    name: 'Senat Gallery',
    number: 1,
    description: 'Main exhibition space — ground floor',
  },
  {
    type: 'gallery' as const,
    name: 'Sector 1 Gallery',
    number: 2,
    description: 'Contemporary installations — first floor',
  },
  {
    type: 'gallery' as const,
    name: 'Iomo Gallery',
    number: 3,
    description: 'Multimedia and video works',
  },
  {
    type: 'gallery' as const,
    name: 'The Institute',
    number: 4,
    description: 'Emerging artists showcase',
  },
  {
    type: 'studio' as const,
    name: 'Artists Studios',
    number: 5,
    description: 'Open studios — meet the sculptors at work',
  },
] as const

const VENUE_ADDRESS = {
  name: 'Combinatul Fondului Plastic',
  street: 'Str. Băiculești 29',
  city: 'Sector 1, București',
  mapsUrl: 'https://maps.google.com/?q=Combinatul+Fondului+Plastic+Bucuresti',
}

const TRANSPORT_ROUTES = [
  {
    from: 'Gara de Nord',
    subtitle: 'Central Station',
    busLines: ['Bus 205', 'Tram 45'],
    station: 'Băiculești stop',
    walkTime: '5 min walk',
  },
  {
    from: 'Piața Presei',
    subtitle: 'North',
    busLines: ['Bus 301', 'Bus 331'],
    station: 'Băiculești stop',
    walkTime: '3 min walk',
  },
  {
    from: 'Piața Unirii',
    subtitle: 'South',
    busLines: ['Bus 205', 'Tram 45'],
    station: 'Băiculești stop',
    walkTime: '5 min walk',
  },
] as const

const PRACTICAL_INFO = [
  {
    title: 'Accessibility',
    icon: RiWheelchairLine,
    content:
      'Ground-floor galleries are wheelchair accessible with ramp entry. Accessible restrooms available. Service animals welcome.',
  },
  {
    title: 'Parking',
    icon: RiParkingBoxLine,
    content:
      'Free street parking available on Str. Băiculești and surrounding streets. Bike parking at the main entrance.',
  },
  {
    title: 'Food & Drink',
    icon: RiCupLine,
    content:
      'On-site café serving coffee, drinks, and light meals. Several restaurants within a 5-minute walk.',
  },
  {
    title: 'Kids Activities',
    icon: RiPaintBrushLine,
    content:
      'Sculpture workshops for ages 6–14 on weekends. Family-friendly guided tours available on request.',
  },
] as const

const PARTNER_VENUES = [
  {
    name: 'Gallery Studio 76',
    address: 'Str. Băiculești 29, Corp B',
  },
  {
    name: 'UNAgaleria',
    address: 'Str. Academiei 39',
  },
  {
    name: 'Galateca Gallery',
    address: 'Str. C.A. Rosetti 2–4',
  },
  {
    name: 'Artmark Gallery',
    address: 'Str. C.A. Rosetti 17',
  },
] as const

export default function VisitPage() {
  return (
    <main>
      {/* ---- 1. Hero — full viewport, dramatic reveal ---- */}
      <section className={styles.hero}>
        <Image
          src={imageSrc(heroImage)}
          alt={heroImage.alt}
          fill
          sizes="100vw"
          className={styles.heroBg}
          priority
        />
        <div className={styles.heroOverlay} />
        <div className={styles.heroInner}>
          <div className={styles.heroTitleWrap}>
            <h1 className={styles.pageTitle}>
              Visit
              <span className={styles.pageTitleHighlight}>ZSB</span>
            </h1>
          </div>

          <p className={styles.heroLead}>
            Combinatul Fondului Plastic — a former industrial complex turned
            creative hub — is the main venue for Bucharest Sculpture Days.
            Explore galleries, open studios, and site-specific installations
            across the compound.
          </p>

          <div className={styles.quickFacts}>
            {QUICK_FACTS.map((fact) => (
              <div key={fact.label} className={styles.quickFact}>
                <fact.icon size={20} className={styles.quickFactIcon} />
                <span className={styles.quickFactLabel}>{fact.label}</span>
                <span className={styles.quickFactValue}>{fact.value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- 2. Venue Map — blueprint layout ---- */}
      <section className={`${styles.section} ${shared.sectionLight}`}>
        <div className={shared.sectionInner}>
          <div className={shared.sectionHeader}>
            <h2 className={styles.sectionTitle}>Venue Map</h2>
          </div>

          <div className={styles.mapLayout}>
            <div className={styles.mapContainer}>
              <Image
                src="/img/map.png"
                alt="Venue map of Combinatul Fondului Plastic"
                width={1200}
                height={800}
                className={styles.mapImage}
                sizes="(max-width: 1023px) 100vw, 60vw"
              />
            </div>

            <div className={styles.legendList}>
              {MAP_LOCATIONS.map((loc) => (
                <div key={loc.number} className={styles.legendItem}>
                  <span className={styles.legendBadge}>{loc.number}</span>
                  <div className={styles.legendInfo}>
                    <span className={styles.legendName}>{loc.name}</span>
                    <span className={styles.legendDesc}>{loc.description}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---- 3. Plan Your Visit — directions + practical info ---- */}
      <section className={`${styles.section} ${shared.sectionDark}`}>
        <div className={shared.sectionInner}>
          <div className={shared.sectionHeader}>
            <h2 className={styles.sectionTitle}>Plan Your Visit</h2>
          </div>

          <div className={styles.addressBlock}>
            <address className={styles.address}>
              <span className={styles.addressName}>{VENUE_ADDRESS.name}</span>
              <span className={styles.addressStreet}>
                {VENUE_ADDRESS.street}
              </span>
              <span className={styles.addressCity}>{VENUE_ADDRESS.city}</span>
            </address>
            <a
              href={VENUE_ADDRESS.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.mapsButton}
            >
              <RiMapPinLine size={16} />
              <span>Open in Google Maps</span>
            </a>
          </div>

          <div className={styles.transportGrid}>
            {TRANSPORT_ROUTES.map((route) => (
              <div key={route.from} className={styles.transportCard}>
                <div className={styles.transportFrom}>
                  <span className={styles.transportOrigin}>{route.from}</span>
                  <span className={styles.transportSubtitle}>
                    {route.subtitle}
                  </span>
                </div>
                <div className={styles.transportDetails}>
                  <div className={styles.transportLine}>
                    <RiBusLine size={16} className={styles.transportIcon} />
                    <span>{route.busLines.join(' / ')}</span>
                  </div>
                  <div className={styles.transportLine}>
                    <RiMapPinLine size={16} className={styles.transportIcon} />
                    <span>{route.station}</span>
                  </div>
                  <div className={styles.transportLine}>
                    <RiWalkLine size={16} className={styles.transportIcon} />
                    <span>{route.walkTime}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <hr className={styles.practicalDivider} />

          <div className={styles.infoGrid}>
            {PRACTICAL_INFO.map((info) => (
              <div key={info.title} className={styles.infoCard}>
                <div className={styles.infoCardHead}>
                  <info.icon size={22} className={styles.infoIcon} />
                  <h3 className={styles.infoTitle}>{info.title}</h3>
                </div>
                <p className={styles.infoContent}>{info.content}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- 4. Partner Venues — dramatic list ---- */}
      <section className={`${styles.section} ${shared.sectionDark}`}>
        <div className={shared.sectionInner}>
          <div className={shared.sectionHeader}>
            <h2 className={styles.sectionTitle}>Partner Venues</h2>
          </div>

          <div className={styles.venueList}>
            {PARTNER_VENUES.map((venue) => (
              <div key={venue.name} className={styles.venueEntry}>
                <span className={styles.venueName}>{venue.name}</span>
                <span className={styles.venueAddress}>{venue.address}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
