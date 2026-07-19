import { RiArrowRightLine } from '@remixicon/react'
import { homePage } from '@site/page.recipe'
import { ArtistsBanner } from '@site-components/ArtistsBanner'
import { FeaturedSpotlight } from '@site-components/FeaturedSpotlight'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { cx } from 'styled-system/css'
import { Divider, Grid, HStack, Stack, Text } from 'styled-system/jsx'
import { section } from 'styled-system/recipes'
import { AccentSplit } from '@/components/AccentSplit/AccentSplit'
import { HomepageCarousel } from '@/components/Carousel/HomepageCarousel'
import { DraftAware } from '@/components/DraftAware/DraftAware'
import { PartnerBadge } from '@/components/PartnerBadge/PartnerBadge'
import { Badge } from '@/components/ui/Badge/Badge'
import { Button } from '@/components/ui/Button/Button'
import { LinkList, LinkListItem } from '@/components/ui/LinkList/LinkList'
import { SectionHeading } from '@/components/ui/SectionHeading/SectionHeading'
import {
  getEditionListItems,
  getFeaturedEvents,
  getHeroUpcoming,
  type UpcomingHero,
} from '@/data/editions'
import { SITE_DESCRIPTION } from '@/lib/constants'
import { editionHref } from '@/lib/edition-href'
import { PLACEHOLDER_IMAGE } from '@/lib/placeholder'
import { pageMetadata } from '@/lib/seo'
import { type EditionListItem } from '@/sanity/lib/editions'
import { getHomepage, type HomeView } from '@/sanity/lib/homepage'
import { type DynamicFetchOptions, getDynamicFetchOptions } from '@/sanity/lib/live'
import type { CalendarEvent } from '@/types/edition'

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
                <Text variant="caption" className={styles.upcomingEyebrow}>
                  Upcoming · ZSB {upcoming.year}
                </Text>
                <Text as="h1" variant="display" className={styles.heroTitle}>
                  <AccentSplit text={upcoming.theme} accent={upcoming.themeHighlight} lineBreak />
                </Text>
                <Text as="p" variant="body">
                  {upcoming.dateTape}
                </Text>
                <PartnerBadge size="upcoming" />
              </Stack>

              <Divider />
              <Stack as="aside" className={styles.lastEdition}>
                <Text as="p" variant="label">
                  From the last edition
                </Text>
                <div className={styles.lastEditionMedia}>
                  <HomepageCarousel images={slideshow} />
                </div>
                {ctaLabel && ctaYear && (
                  <Button asChild variant="primary" size="lg">
                    <Link href={editionHref(ctaYear)}>
                      {ctaLabel} <RiArrowRightLine size={14} />
                    </Link>
                  </Button>
                )}
              </Stack>
            </HStack>
          </section>
        ) : (
          <section id="home" className={cx(styles.panel, styles.hero)}>
            <Grid
              className={styles.heroInner}
              gridTemplateColumns={{ lg: '1fr auto' }}
              rowGap={{ base: 'lg', lg: '3xl' }}
              columnGap={{ lg: '2xl' }}
              alignItems={{ lg: 'start' }}
            >
              <Stack className={styles.heroPanel} gap="lg">
                <Text as="h1" variant="display" className={styles.heroTitle}>
                  <AccentSplit text={title} accent={accent} lineBreak />
                </Text>
                <Stack gap="lg" alignItems="flex-start">
                  <Text as="p" variant="lead">
                    {lead}
                  </Text>
                  {ctaLabel && ctaYear && (
                    <Button asChild variant="primary" size="lg">
                      <Link href={editionHref(ctaYear)}>
                        {ctaLabel} <RiArrowRightLine size={14} />
                      </Link>
                    </Button>
                  )}
                </Stack>
              </Stack>

              <div className={styles.heroBadge}>
                <PartnerBadge size="hero" />
              </div>

              <div className={styles.heroVisual}>
                <HomepageCarousel images={slideshow} />
              </div>
            </Grid>
          </section>
        )}

        {featured && <FeaturedSpotlight year={featured.year} events={featured.events} />}

        <section id="editions" className={cx(styles.panel, section({ ground: 'dark' }))}>
          <Stack gap="2xl">
            <Stack className={styles.editionsHead}>
              <SectionHeading flush>Editions</SectionHeading>
              <Text as="p" variant="caption" className={styles.editionsSubtext}>
                {editionsIntro}
              </Text>
            </Stack>
            <LinkList className={styles.editionList}>
              {list.map((edition) =>
                edition.href ? (
                  <LinkListItem
                    key={edition.year}
                    year={edition.year}
                    title={edition.theme}
                    href={edition.href}
                  />
                ) : (
                  <LinkListItem
                    key={edition.year}
                    year={edition.year}
                    title={edition.theme}
                    tags={[<Badge key="status">Coming soon</Badge>]}
                    disabled
                  />
                ),
              )}
            </LinkList>
          </Stack>
        </section>

        <ArtistsBanner />
      </main>
    </>
  )
}
