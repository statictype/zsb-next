import { RiArrowRightLine, RiArrowRightUpLine } from '@remixicon/react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { css, cx } from 'styled-system/css'
import { button, section } from 'styled-system/recipes'
import { AccentSplit } from '@/components/AccentSplit/AccentSplit'
import { ArtistsBanner } from '@/components/ArtistsBanner/ArtistsBanner'
import { DraftAware } from '@/components/DraftAware/DraftAware'
import { enter } from '@/components/enter'
import { FeaturedSpotlight } from '@/components/FeaturedEvents/FeaturedSpotlight'
import { HeroSlideshow } from '@/components/HeroSlideshow/HeroSlideshow'
import { Navigation } from '@/components/Navigation/Navigation'
import { PartnerBadge } from '@/components/PartnerBadge/PartnerBadge'
import { Badge } from '@/components/ui/Badge/Badge'
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
import { getHomepage, type HomeView } from '@/sanity/lib/homepage'
import { type DynamicFetchOptions, getDynamicFetchOptions } from '@/sanity/lib/live'
import type { CalendarEvent } from '@/types/edition'
import { homePage } from './page.recipe'

const styles = homePage()

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
  return <DraftAware cached={(options) => <CachedHome options={options} />} fallback={null} />
}

async function CachedHome({ options }: { options: DynamicFetchOptions }) {
  'use cache'
  const [home, editions, upcoming, featured] = await Promise.all([
    getHomepage(options),
    getEditionListItems(options),
    getHeroUpcoming(options),
    getFeaturedEvents(options),
  ])
  if (!home) notFound()
  return <HomeShell view={home} editions={editions} upcoming={upcoming} featured={featured} />
}

interface HomeShellProps {
  view: HomeView
  editions: EditionListItem[]
  /** Set when the hero switch leads with Upcoming and a next edition exists. */
  upcoming: UpcomingHero | null
  /** Newest live edition's featured events; past ones hidden client-side. */
  featured: { year: number; events: CalendarEvent[] } | undefined
}

function HomeShell({ view, editions, upcoming, featured }: HomeShellProps) {
  const {
    heroTitle: title,
    heroTitleAccent: accent,
    heroLead: lead,
    heroCtaLabel: ctaLabel,
    heroCtaEditionYear: ctaYear,
    editionsIntro,
    slideshow: slides,
  } = view
  const slideshow = slides.length > 0 ? slides : [{ ...PLACEHOLDER_IMAGE, position: 'center' }]
  const list = editions

  return (
    <>
      <Navigation activeId="home" />
      <main>
        {upcoming ? (
          // Hero switch leads with the Upcoming edition (ZSB-44). It has no
          // photography of its own yet, so the last edition's slideshow + CTA are
          // kept as a compact "from the last edition" side card.
          <section id="home" className={cx(styles.panel, styles.hero)}>
            <div className={styles.upcomingInner}>
              <div className={styles.upcomingLead}>
                <p className={styles.upcomingEyebrow}>Upcoming · ZSB {upcoming.year}</p>
                <h1 className={cx(styles.heroTitle, enter())}>
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
                  <Link
                    href={`/editions/${ctaYear}`}
                    className={button({ variant: 'secondary', size: 'md' })}
                  >
                    {ctaLabel} <RiArrowRightLine size={14} />
                  </Link>
                )}
              </aside>
            </div>
          </section>
        ) : (
          <section id="home" className={cx(styles.panel, styles.hero)}>
            <div className={styles.heroInner}>
              <div className={styles.heroPanel}>
                <h1 className={cx(styles.heroTitle, enter())}>
                  <AccentSplit text={title} accent={accent} lineBreak />
                </h1>
                <div className={styles.heroText}>
                  <p className={css({ textStyle: 'heroLead' })}>{lead}</p>
                  {ctaLabel && ctaYear && (
                    <Link
                      href={`/editions/${ctaYear}`}
                      className={button({ variant: 'secondary', size: 'lg' })}
                    >
                      {ctaLabel} <RiArrowRightLine size={14} />
                    </Link>
                  )}
                </div>
              </div>

              <div className={styles.heroBadge}>
                <PartnerBadge />
              </div>

              <div className={styles.heroVisual}>
                <HeroSlideshow images={slideshow} />
              </div>
            </div>
          </section>
        )}

        {featured && <FeaturedSpotlight year={featured.year} events={featured.events} />}

        <section id="editions" className={cx(styles.panel, section({ ground: 'dark' }))}>
          <div className={styles.editionsHead}>
            <h2 className={css({ textStyle: 'sectionTitle' })}>EDITIONS</h2>
            <p className={styles.editionsSubtext}>{editionsIntro}</p>
          </div>
          <div className={styles.editionList}>
            {list.map((edition) => {
              if (edition.status === 'upcoming') {
                return (
                  <div
                    key={edition.year}
                    className={cx(styles.editionRow, styles.editionRowDisabled)}
                    aria-disabled="true"
                  >
                    <span className={styles.editionYear}>{edition.year}</span>
                    <span className={styles.editionTheme}>{edition.theme}</span>
                    <Badge size="sm" className={css({ flexShrink: '0' })}>
                      Coming soon
                    </Badge>
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
