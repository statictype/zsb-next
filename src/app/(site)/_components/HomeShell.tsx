import { RiArrowRightLine } from '@remixicon/react'
import { homePage } from '@site/page.recipe'
import { ArtistsBanner } from '@site-components/ArtistsBanner'
import { FeaturedSpotlight } from '@site-components/FeaturedSpotlight'
import Link from 'next/link'
import { cx } from 'styled-system/css'
import { Divider, Grid, HStack, Stack, Text } from 'styled-system/jsx'
import { section } from 'styled-system/recipes'
import { HomepageCarousel } from '@/components/Carousel/HomepageCarousel'
import { EditionTheme } from '@/components/EditionTheme/EditionTheme'
import { PartnerBadge } from '@/components/PartnerBadge/PartnerBadge'
import { PartnerStrip } from '@/components/PartnerStrip/PartnerStrip'
import { Badge } from '@/components/ui/Badge/Badge'
import { Button } from '@/components/ui/Button/Button'
import { LinkList, LinkListItem } from '@/components/ui/LinkList/LinkList'
import { SectionHeading } from '@/components/ui/SectionHeading/SectionHeading'
import { editionHref } from '@/lib/edition-href'
import { PLACEHOLDER_IMAGE } from '@/lib/placeholder'
import type { HomeData } from '@/sanity/lib/homepage'

const styles = homePage()

export function HomeShell({ view, editions, upcoming, featured }: HomeData) {
  const {
    heroTitle: title,
    heroLead: lead,
    heroCtaLabel: ctaLabel,
    heroCtaEditionYear: ctaYear,
    editionsIntro,
    slideshow: slides,
    partners,
  } = view
  const slideshow = slides.length > 0 ? slides : [{ ...PLACEHOLDER_IMAGE, position: 'center' }]
  const list = editions

  return (
    <main>
      {upcoming ? (
        // Hero switch leads with the Upcoming edition (ZSB-44). It has no
        // photography of its own yet, so the last edition's slideshow + CTA are
        // kept as a compact "from the last edition" side card.
        <section id="home" className={cx(styles.panel, styles.hero)}>
          <HStack
            className={styles.heroRail}
            flexDirection={{ base: 'column', lg: 'row' }}
            alignItems={{ base: 'stretch', lg: 'flex-start' }}
            justify={{ lg: 'space-between' }}
            gap={{ base: '2xl', lg: '3xl' }}
          >
            <Stack className={styles.upcomingLead} gap="lg">
              <Text variant="caption" className={styles.upcomingEyebrow}>
                Upcoming · ZSB {upcoming.year}
              </Text>
              <Text as="h1" variant="display" color="gray.200" className={styles.heroTitle}>
                {upcoming.theme}
              </Text>
              <Text as="p" variant="body">
                {upcoming.dateLine}
              </Text>
              <div className={styles.upcomingBadge}>
                <PartnerBadge size="upcoming" />
              </div>
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
            className={styles.heroRail}
            gridTemplateColumns={{ lg: 'minmax(0, 38%) minmax(0, 1fr)' }}
            rowGap={{ base: 'xl', lg: '0' }}
            columnGap={{ lg: '2xl' }}
            alignItems={{ lg: 'center' }}
          >
            <Stack className={styles.heroPanel} gap="lg">
              <Text as="h1" variant="display" color="gray.200" className={styles.heroTitle}>
                {title}
              </Text>
              <Stack gap="lg" alignItems="flex-start">
                <Text as="p" variant="body">
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

            <div className={styles.heroVisual}>
              <HomepageCarousel images={slideshow} />
            </div>
          </Grid>
        </section>
      )}

      <PartnerStrip partners={partners} />

      {featured && <FeaturedSpotlight year={featured.year} events={featured.events} />}

      <section id="editions" className={cx(styles.panel, section({ ground: 'dark' }))}>
        <div className={styles.editionsLayout}>
          <Stack className={styles.editionsHead}>
            <SectionHeading flush>Editions</SectionHeading>
            <Text as="p" variant="caption" className={styles.editionsSubtext}>
              {editionsIntro}
            </Text>
          </Stack>
          <LinkList className={styles.editionList}>
            {list.map((edition) => {
              const year = (
                <>
                  <span className={styles.editionPrefix}>ZSB</span> {edition.year}
                </>
              )
              const live = edition.status === 'live'
              const theme = live ? (
                <EditionTheme
                  as="span"
                  size="row"
                  interactive
                  className={styles.editionThemeRow}
                  theme={edition.theme}
                  themeHighlight={edition.themeHighlight}
                />
              ) : (
                <EditionTheme
                  as="span"
                  size="row"
                  muted
                  accent="none"
                  className={styles.editionThemeRow}
                  theme={edition.theme}
                  themeHighlight={edition.themeHighlight}
                />
              )
              return live ? (
                <LinkListItem
                  key={edition.year}
                  emphasis="year"
                  year={year}
                  title={theme}
                  href={edition.href}
                />
              ) : (
                <LinkListItem
                  key={edition.year}
                  emphasis="year"
                  year={year}
                  title={theme}
                  tags={[<Badge key="status">Coming soon</Badge>]}
                  disabled
                />
              )
            })}
          </LinkList>
        </div>
      </section>

      <ArtistsBanner />
    </main>
  )
}
