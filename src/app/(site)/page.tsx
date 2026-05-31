import { RiArrowRightLine, RiArrowRightUpLine } from '@remixicon/react'
import { draftMode } from 'next/headers'
import Link from 'next/link'
import { Suspense } from 'react'
import { ArtistsBanner } from '@/components/ArtistsBanner/ArtistsBanner'
import { type HeroImage, HeroSlideshow } from '@/components/HeroSlideshow/HeroSlideshow'
import { MagneticButton } from '@/components/MagneticButton/MagneticButton'
import { Navigation } from '@/components/Navigation/Navigation'
import shared from '@/components/Shared.module.css'
import { getEditionListItems } from '@/data/editions'
import { type EditionListItem } from '@/sanity/lib/editions'
import { getHomepage, type Homepage } from '@/sanity/lib/homepage'
import { type DynamicFetchOptions, getDynamicFetchOptions } from '@/sanity/lib/live'
import { urlFor } from '@/sanity/lib/image'
import { blobUrl } from '@/lib/blob'
import { pageMetadata } from '@/lib/seo'
import styles from './page.module.css'

export const metadata = pageMetadata({
  description:
    'An annual contemporary sculpture event transforming Bucharest into an open-air museum. Discover editions, artists, and public art since 2021.',
  path: '/',
})

// Defaults render when the homepage doc isn't published yet (fresh
// dataset) — keeps the page presentable instead of crashing.
const FALLBACK_HERO_IMAGES: HeroImage[] = [
  { src: blobUrl('2025/_dsc5496.jpg'), alt: 'ZSB 2025', position: 'top' },
  { src: blobUrl('2025/_dsc5562.jpg'), alt: 'ZSB 2025', position: 'center' },
  { src: blobUrl('2025/bws02058.jpg'), alt: 'ZSB 2025', position: 'center' },
  { src: blobUrl('2025/_dsc5501.jpg'), alt: 'ZSB 2025', position: 'bottom' },
  { src: blobUrl('2025/_dsc5547.jpg'), alt: 'ZSB 2025', position: 'top' },
  { src: blobUrl('2025/_dsc5464.jpg'), alt: 'ZSB 2025', position: 'center' },
  { src: blobUrl('2025/_dsc5665.jpg'), alt: 'ZSB 2025', position: 'top' },
]

const FALLBACK = {
  heroTitle: 'Bucharest Sculpture Days',
  heroTitleAccent: 'Sculpture Days',
  heroLead: 'Artists shift the boundaries of form. ZSB gives those shifts a place to land.',
  heroCtaLabel: 'Explore the 2025 edition',
  heroCtaEditionYear: 2025,
  editionsIntro:
    'Edition after edition, ZSB holds open the question of what sculpture can do with body, matter, space, and memory.',
}

export default async function HomePage() {
  const { isEnabled: isDraftMode } = await draftMode()
  if (isDraftMode) {
    return (
      <Suspense fallback={<HomeShell />}>
        <DynamicHome />
      </Suspense>
    )
  }
  return <CachedHome options={{ perspective: 'published', stega: false }} />
}

async function DynamicHome() {
  const options = await getDynamicFetchOptions()
  return <CachedHome options={options} />
}

async function CachedHome({ options }: { options: DynamicFetchOptions }) {
  'use cache'
  const [home, editions] = await Promise.all([
    getHomepage(options),
    getEditionListItems(options),
  ])
  return <HomeShell home={home} editions={editions} />
}

interface HomeShellProps {
  home?: Homepage | null
  editions?: EditionListItem[]
}

function HomeShell({ home, editions }: HomeShellProps = {}) {
  const title = home?.heroTitle ?? FALLBACK.heroTitle
  const accent = home?.heroTitleAccent ?? FALLBACK.heroTitleAccent
  const lead = home?.heroLead ?? FALLBACK.heroLead
  const ctaLabel = home?.heroCtaLabel ?? FALLBACK.heroCtaLabel
  const ctaYear = home?.heroCtaEditionYear ?? FALLBACK.heroCtaEditionYear
  const editionsIntro = home?.editionsIntro ?? FALLBACK.editionsIntro
  const slideshow = mapSlideshow(home?.slideshow) ?? FALLBACK_HERO_IMAGES
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
              <h1 className={shared.pageTitle}>
                <HeroTitle title={title} accent={accent} />
              </h1>
              <div className={styles.heroText}>
                <p className={shared.heroLead}>{lead}</p>
                {ctaLabel && ctaYear && (
                  <MagneticButton href={`/editions/${ctaYear}`} size="md">
                    {ctaLabel} <RiArrowRightLine size={14} />
                  </MagneticButton>
                )}
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
function HeroTitle({ title, accent }: { title: string; accent: string }) {
  const idx = title.indexOf(accent)
  if (idx === -1) return <>{title}</>
  const before = title.slice(0, idx).trimEnd()
  return (
    <>
      {before}
      {before && <br />}
      <span className={shared.accent}>{accent}</span>
    </>
  )
}

function mapSlideshow(
  slides: Homepage['slideshow'] | undefined,
): HeroImage[] | undefined {
  if (!slides?.length) return undefined
  const out: HeroImage[] = []
  for (const slide of slides) {
    if (!slide.image?.asset) continue
    out.push({
      src: urlFor(slide.image).url(),
      alt: slide.image.alt ?? '',
      position: slide.position ?? 'center',
    })
  }
  return out.length ? out : undefined
}
