import { RiArrowRightLine, RiArrowRightUpLine } from '@remixicon/react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { ArtistsBanner } from '@/components/ArtistsBanner/ArtistsBanner'
import { type HeroImage, HeroSlideshow } from '@/components/HeroSlideshow/HeroSlideshow'
import { MagneticButton } from '@/components/MagneticButton/MagneticButton'
import shared from '@/components/Shared.module.css'
import { blobUrl } from '@/lib/blob'
import styles from './page.module.css'

export const metadata: Metadata = {
  description:
    'An annual contemporary sculpture event transforming Bucharest into an open-air museum. Discover editions, artists, and public art since 2021.',
  alternates: { canonical: '/' },
}

const heroImages: HeroImage[] = [
  { src: blobUrl('2025/_dsc5496.jpg'), alt: 'ZSB 2025', position: 'top' },
  { src: blobUrl('2025/_dsc5562.jpg'), alt: 'ZSB 2025', position: 'center' },
  { src: blobUrl('2025/bws02058.jpg'), alt: 'ZSB 2025', position: 'center' },
  { src: blobUrl('2025/_dsc5501.jpg'), alt: 'ZSB 2025', position: 'bottom' },
  { src: blobUrl('2025/_dsc5547.jpg'), alt: 'ZSB 2025', position: 'top' },
  { src: blobUrl('2025/_dsc5464.jpg'), alt: 'ZSB 2025', position: 'center' },
  { src: blobUrl('2025/_dsc5665.jpg'), alt: 'ZSB 2025', position: 'top' },
]

const editions = [
  { year: 2025, theme: '#celălaltcorp', href: '/editions/2025' },
  { year: 2024, theme: '#syzygy', href: '/editions/2024' },
  { year: 2023, theme: 're#situari afective', href: '/editions/2023' },
  { year: 2022, theme: '#perspectiva31', href: '/editions/2022' },
  { year: 2021, theme: '#digitalfield', href: '/editions/2021' },
]

export default function HomePage() {
  return (
    <main className={styles.main}>
      {/* ---- Hero ---- */}
      <section id="home" className={`${styles.panel} ${styles.hero}`}>
        <div className={styles.heroInner}>
          <div className={styles.heroVisual}>
            <HeroSlideshow images={heroImages} />
          </div>

          <div className={styles.heroPanel}>
            <h1 className={shared.pageTitle}>
              Bucharest
              <br />
              <span className={shared.accent}>
                {' '}
                Sculpture
                <br />
                Days
              </span>
            </h1>
            <div className={styles.heroText}>
              <p className={shared.heroLead}>
                Artists shift the boundaries of form. ZSB gives those shifts a place to land.
              </p>
              <MagneticButton href="/editions/2025" size="lg">
                Explore the 2025 edition <RiArrowRightLine size={14} />
              </MagneticButton>
            </div>
          </div>
        </div>
      </section>

      {/* ---- Editions ---- */}
      <section id="editions" className={`${styles.panel} ${styles.editions}`}>
        <div className={styles.editionsHead}>
          <h2 className={shared.sectionTitle}>PAST EDITIONS</h2>
          <p className={styles.editionsSubtext}>
            Edition after edition, ZSB holds open the question of what sculpture can do with body,
            matter, space, and memory.
          </p>
        </div>
        <div className={styles.editionList}>
          {editions.map((edition) => (
            <Link key={edition.year} href={edition.href} className={styles.editionRow}>
              <span className={styles.editionYear}>{edition.year}</span>
              <span className={styles.editionTheme}>{edition.theme}</span>
              <span className={styles.editionArrow}>
                <RiArrowRightUpLine size={24} />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ---- Artists ---- */}
      <ArtistsBanner />
    </main>
  )
}
