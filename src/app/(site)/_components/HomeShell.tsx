import { RiArrowRightLine } from '@remixicon/react'
import { homePage } from '@site/page.recipe'
import { FeaturedSpotlight } from '@site-components/FeaturedSpotlight'
import Link from 'next/link'
import { cx } from 'styled-system/css'
import { Divider, Grid, HStack, Stack, Text } from 'styled-system/jsx'
import { section } from 'styled-system/recipes'
import { HomepageCarousel } from '@/components/Carousel/HomepageCarousel'
import { EditionTheme } from '@/components/EditionTheme/EditionTheme'
import { Figure } from '@/components/Figure/Figure'
import { PartnerBadge } from '@/components/PartnerBadge/PartnerBadge'
import { PartnerStrip } from '@/components/PartnerStrip/PartnerStrip'
import { Badge } from '@/components/ui/Badge/Badge'
import { Button } from '@/components/ui/Button/Button'
import { SectionHeading } from '@/components/ui/SectionHeading/SectionHeading'
import { editionHref } from '@/lib/edition-href'
import { PLACEHOLDER_IMAGE } from '@/lib/placeholder'
import type { HomeData } from '@/sanity/lib/homepage'
import type { EditionSummary } from '@/types/edition'

const styles = homePage()

export function HomeShell({ view, editions, upcoming, featured, artistCount }: HomeData) {
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

      <section id="editions" className={cx(styles.panel, section())}>
        <div className={styles.editionsLayout}>
          <div className={styles.editionsHead}>
            <Stack gap="md">
              <SectionHeading flush>Editions</SectionHeading>
              <Text as="p" variant="caption" className={styles.editionsSubtext}>
                {editionsIntro}
              </Text>
            </Stack>
            <dl className={styles.editionsLedger}>
              {editionTotals(list, artistCount).map((stat) => (
                <div key={stat.label} className={styles.editionsStat}>
                  <Text as="dt" variant="label">
                    {stat.label}
                  </Text>
                  <Text as="dd" variant="caption" color="heading">
                    {stat.value}
                  </Text>
                </div>
              ))}
            </dl>
          </div>
          <ol className={styles.editionsWall}>
            {list.map((edition) => {
              const live = edition.status === 'live'
              const theme = live ? (
                <EditionTheme
                  as="span"
                  size="cell"
                  interactive
                  className={styles.editionThemeRow}
                  theme={edition.theme}
                  themeHighlight={edition.themeHighlight}
                />
              ) : (
                <EditionTheme
                  as="span"
                  size="cell"
                  muted
                  accent="none"
                  className={styles.editionThemeRow}
                  theme={edition.theme}
                  themeHighlight={edition.themeHighlight}
                />
              )
              const body = (
                <>
                  <div className={styles.editionPlate}>
                    <Figure
                      image={edition.thumbImage ?? edition.heroImage}
                      sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                      className={styles.editionImage}
                    />
                  </div>
                  <div className={styles.editionMeta}>
                    <Text as="span" variant="cardTitle">
                      <span className={styles.editionPrefix}>ZSB</span> {edition.year}
                    </Text>
                    {theme}
                    <span className={styles.editionLines}>
                      <Text as="span" variant="label">
                        {live ? editionFactLine(edition) : editionDates(edition)}
                      </Text>
                      {!live && <Badge>Coming soon</Badge>}
                    </span>
                  </div>
                </>
              )
              return (
                <li key={edition.year}>
                  {live ? (
                    <Link className={styles.editionTile} href={edition.href}>
                      {body}
                    </Link>
                  ) : (
                    <div className={styles.editionTile} aria-disabled="true">
                      {body}
                    </div>
                  )}
                </li>
              )
            })}
          </ol>
        </div>
      </section>
    </main>
  )
}

function editionDates(edition: EditionSummary) {
  for (const fact of edition.facts) if (fact.kind === 'dates') return fact.text
  return ''
}

function factCount(edition: EditionSummary, kind: 'artists' | 'events') {
  let total = 0
  for (const fact of edition.facts) if ('count' in fact && fact.kind === kind) total += fact.count
  return total
}

function editionFactLine(edition: EditionSummary) {
  const counts = [
    [factCount(edition, 'artists'), 'artists'] as const,
    [factCount(edition, 'events'), 'events'] as const,
  ]
    .filter(([count]) => count > 0)
    .map(([count, noun]) => `${count} ${noun}`)
  return [editionDates(edition), ...counts].filter(Boolean).join(' · ')
}

function editionTotals(editions: EditionSummary[], artistCount: number) {
  const live = editions.filter((edition) => edition.status === 'live')
  const sum = (kind: 'artists' | 'events') =>
    live.reduce((total, edition) => total + factCount(edition, kind), 0)
  return [
    { label: 'Editions', value: live.length },
    { label: 'Artists', value: artistCount },
    { label: 'Events', value: sum('events') },
  ]
}
