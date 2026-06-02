import {
  RiArrowRightLine,
  RiArrowRightUpLine,
  RiFileTextLine,
  RiNewspaperLine,
  RiPlayCircleLine,
  RiSoundcloudLine,
  RiVimeoLine,
  RiYoutubeLine,
} from '@remixicon/react'
import { stegaClean } from '@sanity/client/stega'
import { draftMode } from 'next/headers'
import { Suspense } from 'react'
import { MediaKitStrip, type MediaKitStripItem } from '@/components/MediaKitStrip/MediaKitStrip'
import { Navigation } from '@/components/Navigation/Navigation'
import shared from '@/components/Shared.module.css'
import { pageMetadata } from '@/lib/seo'
import { urlFor } from '@/sanity/lib/image'
import { type DynamicFetchOptions, getDynamicFetchOptions } from '@/sanity/lib/live'
import {
  type EditionPressKit,
  getEditionsPressKit,
  getPressAppearances,
  getPressPage,
  getPressReleases,
  type PressAppearance,
  type PressPage,
  type PressRelease,
} from '@/sanity/lib/press'
import styles from './page.module.css'

export const metadata = pageMetadata({
  title: 'Press',
  description:
    'Press kit, official posters, releases, and media coverage for Bucharest Sculpture Days — across every edition.',
  path: '/press',
})

// Editor-facing labels live on the Sanity `pressAppearance.type` enum;
// the icon and short renderer label live here because they're a
// renderer concern (and CMSing icon picks isn't worth the surface area).
type AppearanceType = NonNullable<PressAppearance['type']>
const TYPE_META: Record<AppearanceType, { label: string; Icon: typeof RiYoutubeLine }> = {
  youtube: { label: 'Video', Icon: RiYoutubeLine },
  vimeo: { label: 'Video', Icon: RiVimeoLine },
  soundcloud: { label: 'Audio', Icon: RiSoundcloudLine },
  article: { label: 'Article', Icon: RiNewspaperLine },
  tv: { label: 'Broadcast', Icon: RiPlayCircleLine },
}

const FALLBACK = {
  heroTitle: 'Press room',
  heroTitleAccent: 'room',
  heroLead:
    'A reference desk for editors, reporters, and curators. Posters, releases, and media coverage from every edition since 2021.',
  mediaKitEyebrow: 'Media',
}

export default async function PressRoute() {
  const { isEnabled: isDraftMode } = await draftMode()
  if (isDraftMode) {
    return (
      <Suspense fallback={<PressShell />}>
        <DynamicPress />
      </Suspense>
    )
  }
  return <CachedPress options={{ perspective: 'published', stega: false }} />
}

async function DynamicPress() {
  const options = await getDynamicFetchOptions()
  return <CachedPress options={options} />
}

async function CachedPress({ options }: { options: DynamicFetchOptions }) {
  'use cache'
  const [page, appearances, releases, kit] = await Promise.all([
    getPressPage(options),
    getPressAppearances(options),
    getPressReleases(options),
    getEditionsPressKit(options),
  ])
  return (
    <PressShell page={page} appearances={appearances} releases={releases} kit={kit} />
  )
}

interface PressShellProps {
  page?: PressPage | null
  appearances?: PressAppearance[]
  releases?: PressRelease[]
  kit?: EditionPressKit[]
}

function PressShell({ page, appearances, releases, kit }: PressShellProps = {}) {
  const title = page?.hero?.title ?? FALLBACK.heroTitle
  const accent = page?.hero?.titleAccent ?? FALLBACK.heroTitleAccent
  const lead = page?.hero?.lead ?? FALLBACK.heroLead
  const eyebrow = page?.mediaKitEyebrow ?? FALLBACK.mediaKitEyebrow
  const kitItems = kit?.length ? flattenKit(kit) : []

  return (
    <>
      <Navigation activeId={null} />
      <main className={styles.page}>
        {/* ===== Hero ===== */}
        <section className={styles.hero}>
          <div className={styles.heroInner}>
            <h1 className={shared.pageTitle}>
              <HeroTitle title={title} accent={accent} />
            </h1>
            <p className={shared.lead}>{lead}</p>
          </div>
        </section>

        {/* ===== Media Kit Strip ===== */}
        {kitItems.length > 0 && (
          <section id="media-kit" className={styles.kitSection}>
            <div className={styles.kitHeader}>
              <h2 className={`${shared.sectionTitle} ${styles.kitTitle}`}>{eyebrow} kit</h2>
            </div>
            <MediaKitStrip items={kitItems} />
          </section>
        )}

        {/* ===== Appearances ===== */}
        {appearances && appearances.length > 0 && (
          <section className={styles.appearances}>
            <div className={styles.appearancesInner}>
              <h2 className={shared.sectionTitle}>Press appearances</h2>

              <ul className={styles.appList}>
                {appearances.map((item) => {
                  if (!item.type) return null
                  const meta = TYPE_META[item.type]
                  const Icon = meta.Icon
                  return (
                    <li key={item._id} className={styles.appRow}>
                      <a
                        href={item.url ?? '#'}
                        className={styles.appLink}
                        target="_blank"
                        rel="noreferrer noopener"
                      >
                        <span className={styles.appType}>
                          <Icon size={24} />
                          <span>{meta.label}</span>
                        </span>
                        <span className={styles.appAside}>
                          <span className={styles.appDate}>{item.year}</span>
                          <span className={styles.appTag}>{item.tag}</span>
                        </span>
                        <span className={styles.appBody}>
                          <span className={styles.appText}>
                            <span className={styles.appTitle}>{item.title}</span>
                            {item.excerpt && (
                              <span className={styles.appExcerpt}>{item.excerpt}</span>
                            )}
                          </span>
                          <span className={styles.appArrow}>
                            <RiArrowRightUpLine size={20} />
                          </span>
                        </span>
                      </a>
                    </li>
                  )
                })}
              </ul>
            </div>
          </section>
        )}

        {/* ===== Releases ===== */}
        {releases && releases.length > 0 && (
          <section className={styles.releases}>
            <div className={styles.releasesInner}>
              <h2 className={shared.sectionTitle}>Press releases</h2>

              <ul className={styles.releaseList}>
                {releases.map((release, i) => (
                  <li key={release._id} className={styles.releaseRow}>
                    <a
                      href={release.pdfUrl ? stegaClean(release.pdfUrl) : '#'}
                      className={styles.releaseLink}
                      target="_blank"
                      rel="noreferrer noopener"
                    >
                      <span className={styles.releaseId}>{String(i + 1).padStart(2, '0')}</span>
                      <span className={styles.releaseIcon}>
                        <RiFileTextLine size={24} />
                      </span>
                      <span className={styles.releaseBody}>
                        <span className={styles.releaseTitle}>{release.title}</span>
                        <span className={styles.releaseMeta}>
                          {[release.language, `${release.pages} pages`, formatBytes(release.sizeBytes)]
                            .filter(Boolean)
                            .join(' · ')}
                        </span>
                      </span>
                      <span className={styles.releaseAction}>
                        Download PDF <RiArrowRightLine size={14} />
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}
      </main>
    </>
  )
}

function formatBytes(bytes: number | null | undefined): string | null {
  if (!bytes || bytes <= 0) return null
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function HeroTitle({ title, accent }: { title: string; accent: string }) {
  const idx = title.indexOf(accent)
  if (idx === -1) return <>{title}</>
  const before = title.slice(0, idx)
  return (
    <>
      {before}
      <span className={shared.accent}>{accent}</span>
    </>
  )
}

function flattenKit(editions: EditionPressKit[]): MediaKitStripItem[] {
  const out: MediaKitStripItem[] = []
  for (const ed of editions) {
    if (!ed.year) continue
    if (ed.coverPhoto?.asset) {
      out.push({
        year: ed.year,
        label: 'Photography',
        name: 'Exhibition Cover',
        image: {
          src: urlFor(ed.coverPhoto).url(),
          alt: (ed.coverPhoto as { alt?: string }).alt ?? `ZSB ${ed.year} cover`,
        },
      })
    }
    if (ed.poster?.asset) {
      out.push({
        year: ed.year,
        label: 'Key Visual',
        name: 'Official Poster',
        image: {
          src: urlFor(ed.poster).url(),
          alt: (ed.poster as { alt?: string }).alt ?? `ZSB ${ed.year} poster`,
        },
      })
    }
  }
  return out
}
