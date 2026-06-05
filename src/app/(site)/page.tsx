import { RiArrowRightLine, RiArrowRightUpLine } from '@remixicon/react'
import Link from 'next/link'
import { AccentSplit } from '@/components/AccentSplit/AccentSplit'
import { ArtistsBanner } from '@/components/ArtistsBanner/ArtistsBanner'
import { DraftAware } from '@/components/DraftAware/DraftAware'
import { type HeroImage, HeroSlideshow } from '@/components/HeroSlideshow/HeroSlideshow'
import { MagneticButton } from '@/components/MagneticButton/MagneticButton'
import { Navigation } from '@/components/Navigation/Navigation'
import { PartnerBadge } from '@/components/PartnerBadge/PartnerBadge'
import shared from '@/components/Shared.module.css'
import { getEditionListItems } from '@/data/editions'
import { SITE_DESCRIPTION } from '@/lib/constants'
import { PLACEHOLDER_IMAGE } from '@/lib/placeholder'
import { pageMetadata } from '@/lib/seo'
import { type EditionListItem } from '@/sanity/lib/editions'
import { getHomepage, type Homepage } from '@/sanity/lib/homepage'
import { urlFor } from '@/sanity/lib/image'
import { type DynamicFetchOptions, getDynamicFetchOptions } from '@/sanity/lib/live'
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
  const [home, editions] = await Promise.all([getHomepage(options), getEditionListItems(options)])
  return <HomeShell home={home} editions={editions} />
}

interface HomeShellProps {
  home?: Homepage | null
  editions?: EditionListItem[]
}

function HomeShell({ home, editions }: HomeShellProps = {}) {
  const title = home?.heroTitle ?? ''
  const accent = home?.heroTitleAccent ?? ''
  const lead = home?.heroLead ?? ''
  const ctaLabel = home?.heroCtaLabel ?? ''
  const ctaYear = home?.heroCtaEditionYear
  const editionsIntro = home?.editionsIntro ?? ''
  const slideshow = mapSlideshow(home?.slideshow) ?? [{ ...PLACEHOLDER_IMAGE, position: 'center' }]
  const list = editions ?? []

  return (
    <>
      <Navigation activeId="home" />
      <main className={styles.main}>
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

/**
 * Splits the title at the accent substring and renders the accented
 * portion on a new line with the accent class. Falls back to the plain
 * title if the accent isn't found (schema validates this but the
 * runtime should still degrade gracefully).
 */
function mapSlideshow(slides: Homepage['slideshow'] | undefined): HeroImage[] | undefined {
  if (!slides?.length) return undefined
  const out: HeroImage[] = []
  for (const slide of slides) {
    if (!slide.image?.asset) continue
    out.push({
      src: urlFor(slide.image).url(),
      alt: slide.image.alt ?? '',
      position: slide.position ?? 'center',
      ...(slide.image.lqip ? { blurDataURL: slide.image.lqip } : {}),
    })
  }
  return out.length ? out : undefined
}
