import { RiArrowRightLine } from '@remixicon/react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { cx } from 'styled-system/css'
import { HStack, Stack } from 'styled-system/jsx'
import { button, section } from 'styled-system/recipes'
import { AccentSplit } from '@/components/AccentSplit/AccentSplit'
import { HomepageCarousel } from '@/components/Carousel/HomepageCarousel'
import { DraftAware } from '@/components/DraftAware/DraftAware'
import { PartnerBadge } from '@/components/PartnerBadge/PartnerBadge'
import { Badge } from '@/components/ui/Badge/Badge'
import { Eyebrow } from '@/components/ui/Eyebrow/Eyebrow'
import { LinkList, LinkListItem } from '@/components/ui/LinkList/LinkList'
import { SectionHeading } from '@/components/ui/SectionHeading/SectionHeading'
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
import { ArtistsBanner } from './_components/ArtistsBanner'
import { FeaturedSpotlight } from './_components/FeaturedSpotlight'
import { homePage } from './page.recipe'

const styles = homePage()

export async function generateMetadata() {
  const { perspective } = await getDynamicFetchOptions()
  const home = await getHomepage({ perspective })
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
      <main>
        {upcoming ? (
          // Hero switch leads with the Upcoming edition (ZSB-44). It has no
          // photography of its own yet, so the last edition's slideshow + CTA are
          // kept as a compact "from the last edition" side card.
          <section id="home" className={cx(styles.panel, styles.hero)}>
            <HStack
              className={styles.upcomingInner}
              flexDirection={{ base: 'column', lg: 'row' }}
              alignItems={{ base: 'stretch', lg: 'flex-start' }}
              justify={{ lg: 'space-between' }}
              gap={{ base: '2xl', lg: '3xl' }}
            >
              <Stack className={styles.upcomingLead} gap="lg">
                <Eyebrow className={styles.upcomingEyebrow}>Upcoming · ZSB {upcoming.year}</Eyebrow>
                <h1 className={styles.heroTitle}>
                  <AccentSplit text={upcoming.theme} accent={upcoming.themeHighlight} lineBreak />
                </h1>
                <p className={styles.upcomingDates}>{upcoming.dateTape}</p>
                <div className={styles.upcomingBadge}>
                  <PartnerBadge size="upcoming" />
                </div>
              </Stack>

              <Stack as="aside" className={styles.lastEdition}>
                <p className={styles.lastEditionLabel}>From the last edition</p>
                <div className={styles.lastEditionMedia}>
                  <HomepageCarousel images={slideshow} />
                </div>
                {ctaLabel && ctaYear && (
                  <Link
                    href={`/editions/${ctaYear}`}
                    className={button({ variant: 'primary', size: 'lg' })}
                  >
                    {ctaLabel} <RiArrowRightLine size={14} />
                  </Link>
                )}
              </Stack>
            </HStack>
          </section>
        ) : (
          <section id="home" className={cx(styles.panel, styles.hero)}>
            <div className={styles.heroInner}>
              <Stack className={styles.heroPanel} gap="lg">
                <h1 className={styles.heroTitle}>
                  <AccentSplit text={title} accent={accent} lineBreak />
                </h1>
                <Stack gap="lg">
                  <p className={styles.heroLead}>{lead}</p>
                  {ctaLabel && ctaYear && (
                    <Link
                      href={`/editions/${ctaYear}`}
                      className={button({ variant: 'primary', size: 'lg' })}
                    >
                      {ctaLabel} <RiArrowRightLine size={14} />
                    </Link>
                  )}
                </Stack>
              </Stack>

              <div className={styles.heroBadge}>
                <PartnerBadge size="hero" />
              </div>

              <div className={styles.heroVisual}>
                <HomepageCarousel images={slideshow} />
              </div>
            </div>
          </section>
        )}

        {featured && <FeaturedSpotlight year={featured.year} events={featured.events} />}

        <section id="editions" className={cx(styles.panel, section({ ground: 'dark' }))}>
          <Stack className={styles.editionsHead}>
            <SectionHeading flush>Editions</SectionHeading>
            <p className={styles.editionsSubtext}>{editionsIntro}</p>
          </Stack>
          <LinkList className={styles.editionList}>
            {list.map((edition) => {
              if (edition.status === 'upcoming') {
                return (
                  <LinkListItem
                    key={edition.year}
                    year={edition.year}
                    title={edition.theme}
                    tags={[<Badge key="status">Coming soon</Badge>]}
                    disabled
                  />
                )
              }
              return (
                <LinkListItem
                  key={edition.year}
                  year={edition.year}
                  title={edition.theme}
                  href={`/editions/${edition.year}`}
                />
              )
            })}
          </LinkList>
        </section>

        <ArtistsBanner />
      </main>
    </>
  )
}
