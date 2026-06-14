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
import { notFound } from 'next/navigation'
import { AccentSplit } from '@/components/AccentSplit/AccentSplit'
import { DraftAware } from '@/components/DraftAware/DraftAware'
import { JsonLd } from '@/components/JsonLd/JsonLd'
import { MediaKitStrip } from '@/components/MediaKitStrip/MediaKitStrip'
import { Navigation } from '@/components/Navigation/Navigation'
import shared from '@/components/Shared.module.css'
import { makePageMetadata, organizationJsonLd, pressAppearancesJsonLd } from '@/lib/seo'
import { type DynamicFetchOptions } from '@/sanity/lib/live'
import {
  getEditionsPressKit,
  getPressAppearances,
  getPressPage,
  getPressReleases,
  type PressAppearance,
  type PressPageView,
  type PressRelease,
} from '@/sanity/lib/press'
import { getSiteSettings, type SiteSettings } from '@/sanity/lib/settings'
import type { MediaKitStripItem } from '@/types/edition'
import styles from './page.module.css'

export const generateMetadata = makePageMetadata(getPressPage, {
  title: 'Press',
  path: '/press',
})

type Medium = NonNullable<PressAppearance['medium']>

const MEDIUM_LABEL: Record<Medium, string> = {
  article: 'Article',
  video: 'Video',
  audio: 'Audio',
}

function iconForUrl(url: string, medium: Medium): typeof RiYoutubeLine {
  try {
    const host = new URL(url).hostname
    if (host.includes('youtube.com') || host.includes('youtu.be')) return RiYoutubeLine
    if (host.includes('vimeo.com')) return RiVimeoLine
    if (host.includes('soundcloud.com')) return RiSoundcloudLine
  } catch {
    /* invalid URL — fall through to medium fallback */
  }
  if (medium === 'video') return RiPlayCircleLine
  if (medium === 'audio') return RiSoundcloudLine
  return RiNewspaperLine
}

export default function PressRoute() {
  return <DraftAware cached={(options) => <CachedPress options={options} />} fallback={null} />
}

async function CachedPress({ options }: { options: DynamicFetchOptions }) {
  'use cache'
  const [page, appearances, releases, kit, settings] = await Promise.all([
    getPressPage(options),
    getPressAppearances(options),
    getPressReleases(options),
    getEditionsPressKit(options),
    getSiteSettings(options),
  ])
  if (!page) notFound()
  return (
    <PressShell
      view={page}
      appearances={appearances}
      releases={releases}
      kit={kit}
      settings={settings}
    />
  )
}

interface PressShellProps {
  view: PressPageView
  appearances: PressAppearance[]
  releases: PressRelease[]
  kit: MediaKitStripItem[]
  settings: SiteSettings | null
}

function PressShell({ view, appearances, releases, kit, settings }: PressShellProps) {
  const { hero } = view

  return (
    <>
      <JsonLd
        data={organizationJsonLd({
          sameAs: [settings?.instagramUrl, settings?.facebookUrl],
        })}
      />
      {appearances.length > 0 && <JsonLd data={pressAppearancesJsonLd(appearances)} />}
      <Navigation activeId={null} />
      <main className={styles.page}>
        {/* ===== Hero ===== */}
        <section className={shared.pageHero}>
          <div className={shared.sectionInner}>
            <h1 className={shared.pageTitle}>
              <AccentSplit text={hero.title} accent={hero.titleAccent} />
            </h1>
            <p className={shared.lead}>{hero.lead}</p>
          </div>
        </section>

        {/* ===== Media Kit Strip ===== */}
        {kit.length > 0 && (
          <section id="media-kit" className={styles.kitSection}>
            <div className={styles.kitHeader}>
              <h2 className={`${shared.sectionTitle} ${styles.kitTitle}`}>Media kit</h2>
            </div>
            <MediaKitStrip items={kit} />
          </section>
        )}

        {/* ===== Appearances ===== */}
        {appearances.length > 0 && (
          <section className={styles.appearances}>
            <div className={styles.appearancesInner}>
              <h2 className={shared.sectionTitle}>Press appearances</h2>

              <ul className={styles.appList}>
                {appearances.map((item) => {
                  if (!item.medium || !item.url) return null
                  const Icon = iconForUrl(item.url, item.medium)
                  return (
                    <li key={item._id} className={styles.appRow}>
                      <a
                        href={item.url}
                        className={styles.appLink}
                        target="_blank"
                        rel="noreferrer noopener"
                      >
                        <span className={styles.appType}>
                          <Icon size={24} />
                          <span>{MEDIUM_LABEL[item.medium]}</span>
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
        {releases.length > 0 && (
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
                          {[
                            release.language,
                            `${release.pages} pages`,
                            formatBytes(release.sizeBytes),
                          ]
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
