import { RiArrowRightLine, RiArrowRightUpLine } from '@remixicon/react'
import Link from 'next/link'
import { AccentSplit } from '@/components/AccentSplit/AccentSplit'
import { ArtistsBanner } from '@/components/ArtistsBanner/ArtistsBanner'
import { DraftAware } from '@/components/DraftAware/DraftAware'
import { FeaturedSpotlight } from '@/components/FeaturedEvents/FeaturedSpotlight'
import { HeroSlideshow } from '@/components/HeroSlideshow/HeroSlideshow'
import { MagneticButton } from '@/components/MagneticButton/MagneticButton'
import { Navigation } from '@/components/Navigation/Navigation'
import { PartnerBadge } from '@/components/PartnerBadge/PartnerBadge'
import shared from '@/components/Shared.module.css'
import {
  getEditionListItems,
  getFeaturedEvents,
  getHeroUpcoming,
  type UpcomingHero,
} from '@/data/editions'
import { SITE_DESCRIPTION } from '@/lib/constants'
import { PLACEHOLDER_IMAGE } from '@/lib/placeholder'
import { pageMetadata } from '@/lib/seo'
import { type EditionListItem } from '@/sanity/lib/editions'
import { getHomepage, type Homepage } from '@/sanity/lib/homepage'
import { type DynamicFetchOptions, getDynamicFetchOptions } from '@/sanity/lib/live'
import type { CalendarEvent } from '@/types/edition'
import styles from './page.module.css'

export async function generateMetadata() {
  const { perspective } = await getDynamicFetchOptions()
  const home = await getHomepage({ perspective, stega: false })
  return pageMetadata({
    description: home?.metaDescription ?? SITE_DESCRIPTION,
    path: '/',
    shareImage: home?.ogImage,
  })
}

export default function HomePage() {
  return (
    <DraftAware cached={(options) => <CachedHome options={options} />} fallback={<HomeShell />} />
  )
}

async function CachedHome({ options }: { options: DynamicFetchOptions }) {
  'use cache'
  const [home, editions, upcoming, featured] = await Promise.all([
    getHomepage(options),
    getEditionListItems(options),
    getHeroUpcoming(options),
    getFeaturedEvents(options),
  ])
  return <HomeShell home={home} editions={editions} upcoming={upcoming} featured={featured} />
}

interface HomeShellProps {
  home?: Homepage | null
  editions?: EditionListItem[]
  /** Set when the hero switch leads with Upcoming and a next edition exists. */
  upcoming?: UpcomingHero | null
  /** Newest live edition's featured events; past ones hidden client-side. */
  featured?: { year: number; events: CalendarEvent[] } | undefined
}

function HomeShell({ home, editions, upcoming, featured }: HomeShellProps = {}) {
  const title = home?.heroTitle ?? ''
  const accent = home?.heroTitleAccent ?? ''
  const lead = home?.heroLead ?? ''
  const ctaLabel = home?.heroCtaLabel ?? ''
  const ctaYear = home?.heroCtaEditionYear
  const editionsIntro = home?.editionsIntro ?? ''
  const slides = home?.slideshow ?? []
  const slideshow = slides.length > 0 ? slides : [{ ...PLACEHOLDER_IMAGE, position: 'center' }]
  const list = editions ?? []

  return (
    <>
      <Navigation activeId="home" />
      <main className={styles.main}>
        {upcoming ? (
          // Hero switch leads with the Upcoming edition (ZSB-44). It has no
          // photography of its own yet, so the last edition's slideshow + CTA are
          // kept as a compact "from the last edition" side card.
          <section id="home" className={`${styles.panel} ${styles.hero}`}>
            <div className={styles.upcomingInner}>
              <div className={styles.upcomingLead}>
                <p className={styles.upcomingEyebrow}>Upcoming · ZSB {upcoming.year}</p>
                <h1 className={`${shared.pageTitle} ${styles.heroTitle}`}>
                  <AccentSplit text={upcoming.theme} accent={upcoming.themeHighlight} lineBreak />
                </h1>
                <p className={styles.upcomingDates}>{upcoming.dateTape}</p>
                <div className={styles.upcomingBadge}>
                  <PartnerBadge />
                </div>
              </div>

              <aside className={styles.lastEdition}>
                <p className={styles.lastEditionLabel}>From the last edition</p>
                <div className={styles.lastEditionMedia}>
                  <HeroSlideshow images={slideshow} />
                </div>
                {ctaLabel && ctaYear && (
                  <MagneticButton href={`/editions/${ctaYear}`} size="md">
                    {ctaLabel} <RiArrowRightLine size={14} />
                  </MagneticButton>
                )}
              </aside>
            </div>
          </section>
        ) : (
          <section id="home" className={`${styles.panel} ${styles.hero}`}>
            <div className={styles.heroInner}>
              <div className={styles.heroVisual}>
                <HeroSlideshow images={slideshow} />
              </div>

              <div className={styles.heroPanel}>
                <h1 className={`${shared.pageTitle} ${styles.heroTitle}`}>
                  <AccentSplit text={title} accent={accent} lineBreak />
                </h1>
                <div className={styles.heroText}>
                  <p className={shared.heroLead}>{lead}</p>
                  {ctaLabel && ctaYear && (
                    <MagneticButton href={`/editions/${ctaYear}`} size="md">
                      {ctaLabel} <RiArrowRightLine size={14} />
                    </MagneticButton>
                  )}
                </div>
                <div className={styles.heroBadge}>
                  <PartnerBadge />
                </div>
              </div>
            </div>
          </section>
        )}

        {featured && <FeaturedSpotlight year={featured.year} events={featured.events} />}

        <section id="editions" className={`${styles.panel} ${styles.editions}`}>
          <div className={styles.editionsHead}>
            <h2 className={shared.sectionTitle}>EDITIONS</h2>
            <p className={styles.editionsSubtext}>{editionsIntro}</p>
          </div>
          <div className={styles.editionList}>
            {list.map((edition) => {
              if (edition.status === 'upcoming') {
                return (
                  <div
                    key={edition.year}
                    className={`${styles.editionRow} ${styles.editionRowDisabled}`}
                    aria-disabled="true"
                  >
                    <span className={styles.editionYear}>{edition.year}</span>
                    <span className={styles.editionTheme}>{edition.theme}</span>
                    <span className={styles.editionBadge}>Coming soon</span>
                  </div>
                )
              }
              return (
                <Link
                  key={edition.year}
                  href={`/editions/${edition.year}`}
                  className={styles.editionRow}
                >
                  <span className={styles.editionYear}>{edition.year}</span>
                  <span className={styles.editionTheme}>{edition.theme}</span>
                  <span className={styles.editionArrow}>
                    <RiArrowRightUpLine size={24} />
                  </span>
                </Link>
              )
            })}
          </div>
        </section>

        <ArtistsBanner />
      </main>
    </>
  )
}
