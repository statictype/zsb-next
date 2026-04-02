import { RiArrowRightLine, RiArrowRightUpLine } from '@remixicon/react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { AnimatedStats } from '@/components/AnimatedStats/AnimatedStats'
import { ArtistsSection } from '@/components/ArtistsSection/ArtistsSection'
import { Footer } from '@/components/Footer/Footer'
import { FullPageScroll } from '@/components/FullPageScroll/FullPageScroll'
import { type HeroImage, HeroSlideshow } from '@/components/HeroSlideshow/HeroSlideshow'
import { MagneticButton } from '@/components/MagneticButton/MagneticButton'
import { SECTION_IDS } from '@/components/Navigation/Navigation'
import { PartnerBadge } from '@/components/PartnerBadge/PartnerBadge'
import { VisitSection } from '@/components/VisitSection/VisitSection'
import { ZSB_STATS } from '@/data/stats'
import styles from './page.module.css'

export const metadata: Metadata = {
  description:
    'An annual contemporary sculpture event transforming Bucharest into an open-air museum. Discover editions, artists, and public art since 2021.',
  alternates: { canonical: '/' },
}

const SECTION_COUNT = 6

const heroImages: HeroImage[] = [
  { basePath: '/img/2025/optimized/_dsc5496', alt: 'ZSB 2025', position: 'top' },
  { basePath: '/img/2025/optimized/_dsc5562', alt: 'ZSB 2025', position: 'center' },
  { basePath: '/img/2025/optimized/bws02058', alt: 'ZSB 2025', position: 'center' },
  { basePath: '/img/2025/optimized/_dsc5501', alt: 'ZSB 2025', position: 'bottom' },
  { basePath: '/img/2025/optimized/_DSC5547', alt: 'ZSB 2025', position: 'top' },
  { basePath: '/img/2025/optimized/_dsc5464', alt: 'ZSB 2025', position: 'center' },
  { basePath: '/img/2025/optimized/_dsc5665', alt: 'ZSB 2025', position: 'top' },
]

const editions = [
  { year: 2025, theme: '#celălaltcorp', href: '/editions/2025' },
  { year: 2024, theme: '#syzygy', href: '/editions/2024' },
  { year: 2023, theme: 're#situari afective', href: '/editions/2023' },
  { year: 2022, theme: '#perspectiva31', href: '/editions/2022' },
  { year: 2021, theme: 'online edition', href: '/editions' },
]

export default function HomePage() {
  return (
    <main className={styles.main} data-fullpage>
      <FullPageScroll sectionCount={SECTION_COUNT} sectionIds={SECTION_IDS} />

      {/* ---- 0: Hero ---- */}
      <section id="home" data-section className={styles.panel}>
        <div className={`${styles.fpOuter} fpOuter`}>
          <div className={`${styles.fpInner} fpInner`}>
            <div className={`${styles.hero} ${styles.fpContent}`}>
              <div className={styles.heroImageArea}>
                <HeroSlideshow images={heroImages} />
                <div className={styles.heroBadge}>
                  <PartnerBadge />
                </div>
              </div>
              <div className={styles.heroMeta}>
                <div className={styles.metaBlock}>
                  <span className={styles.metaLabel}>Edition</span>
                  <span className={styles.metaValue}>2025 · 5th Year</span>
                </div>
                <div className={styles.metaRule} />
                <div className={styles.metaBlock}>
                  <span className={styles.metaLabel}>Theme</span>
                  <span className={styles.metaValue}>#celălaltcorp</span>
                </div>
                <div className={styles.metaRule} />
                <MagneticButton variant="secondary" href="/editions/2025">
                  Explore <RiArrowRightLine size={14} />
                </MagneticButton>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---- 1: About ---- */}
      <section id="about" data-section className={styles.panel}>
        <div className={`${styles.fpOuter} fpOuter`}>
          <div className={`${styles.fpInner} fpInner`}>
            <div className={`${styles.about} ${styles.fpContent}`}>
              <div className={styles.aboutGrid}>
                <div>
                  <h2 className={styles.aboutHeading}>
                    Bucharest
                    <br />
                    <span className={styles.aboutAccent}>
                      Sculpture
                      <br />
                      Days
                    </span>
                  </h2>
                  <p className={styles.aboutBody}>
                    Bucharest Sculpture Days is your annual checkpoint for the state of sculpture.
                    For 2 weeks each year, we occupy creative hubs across the city with exhibitions,
                    screenings, and arguments worth having.
                  </p>
                  <MagneticButton href="/about" size="lg">
                    Learn More <RiArrowRightLine size={14} />
                  </MagneticButton>
                </div>

                <AnimatedStats stats={ZSB_STATS} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---- 2: Editions ---- */}
      <section id="editions" data-section className={styles.panel}>
        <div className={`${styles.fpOuter} fpOuter`}>
          <div className={`${styles.fpInner} fpInner`}>
            <div className={`${styles.editions} ${styles.fpContent}`}>
              <div className={styles.editionsHead}>
                <h2 className={styles.editionsTitle}>PAST EDITIONS</h2>
                <Link href="/editions" className={styles.editionsLink}>
                  View Full Archive <RiArrowRightLine size={14} />
                </Link>
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
            </div>
          </div>
        </div>
      </section>

      {/* ---- 3: Artists ---- */}
      <section id="artists" data-section className={styles.panel}>
        <div className={`${styles.fpOuter} fpOuter`}>
          <div className={`${styles.fpInner} fpInner`}>
            <ArtistsSection />
          </div>
        </div>
      </section>

      {/* ---- 4: Visit ---- */}
      <section id="visit" data-section className={styles.panel}>
        <div className={`${styles.fpOuter} fpOuter`}>
          <div className={`${styles.fpInner} fpInner`}>
            <div className={`${styles.visit} ${styles.fpContent}`}>
              <VisitSection />
            </div>
          </div>
        </div>
      </section>

      {/* ---- 5: Footer ---- */}
      <section id="footer" data-section className={styles.panel}>
        <div className={`${styles.fpOuter} fpOuter`}>
          <div className={`${styles.fpInner} fpInner`}>
            <div className={styles.footerSection}>
              <Footer />
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
