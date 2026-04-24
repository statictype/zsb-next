import {
  RiArrowRightUpLine,
  RiDownloadLine,
  RiFileTextLine,
  RiNewspaperLine,
  RiPlayCircleLine,
  RiSoundcloudLine,
  RiYoutubeLine,
} from '@remixicon/react'
import type { Metadata } from 'next'
import { MediaKitStrip, type MediaKitStripItem } from '@/components/MediaKitStrip/MediaKitStrip'
import shared from '@/components/Shared.module.css'
import { getAllEditionYears, getEdition } from '@/data/editions'
import { PRESS_APPEARANCES, type PressAppearanceType } from '@/data/press-appearances'
import { PRESS_RELEASES } from '@/data/press-releases'
import styles from './page.module.css'

export const metadata: Metadata = {
  title: 'Press',
  description:
    'Press kit, official posters, releases, and media coverage for Bucharest Sculpture Days — across every edition.',
  alternates: { canonical: '/press' },
}

const allMediaKit: MediaKitStripItem[] = getAllEditionYears().flatMap((year) => {
  const ed = getEdition(year)
  if (!ed) return []
  return ed.mediaKit.map((item) => ({ ...item, year }))
})

const TYPE_META: Record<PressAppearanceType, { label: string; Icon: typeof RiYoutubeLine }> = {
  youtube: { label: 'Video', Icon: RiYoutubeLine },
  soundcloud: { label: 'Audio', Icon: RiSoundcloudLine },
  article: { label: 'Article', Icon: RiNewspaperLine },
  tv: { label: 'Broadcast', Icon: RiPlayCircleLine },
}

function pad(n: number) {
  return String(n).padStart(2, '0')
}

function formatDate(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export default function PressPage() {
  return (
    <main className={styles.page}>
      {/* ===== Hero ===== */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <h1 className={shared.pageTitle}>
            Press <span className={shared.accent}>room</span>
          </h1>
          <p className={styles.heroLead}>
            A reference desk for editors, reporters, and curators. Posters, releases, and media
            coverage from every edition since 2021.
          </p>
        </div>
      </section>

      {/* ===== Media Kit Strip ===== */}
      <section id="media-kit" className={styles.kitSection}>
        <div className={styles.kitHeader}>
          <h2 className={styles.kitTitle}>Media kit</h2>
          <p className={styles.kitDeck}>
            Official posters and exhibition covers from every ZSB edition. Click any plate to open
            the full-resolution image.
          </p>
        </div>

        <MediaKitStrip items={allMediaKit} />
      </section>

      {/* ===== Appearances ===== */}
      <section className={styles.appearances}>
        <div className={styles.appearancesInner}>
          <h2 className={styles.sectionHeadline}>Press appearances</h2>

          <ul className={styles.appList}>
            {PRESS_APPEARANCES.map((item, i) => {
              const meta = TYPE_META[item.type]
              const Icon = meta.Icon
              return (
                <li key={`${item.url}-${i}`} className={styles.appRow}>
                  <a
                    href={item.url}
                    className={styles.appLink}
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    <span className={styles.appIndex}>{pad(i + 1)}</span>
                    <span className={styles.appType}>
                      <Icon size={18} />
                      <span>{meta.label}</span>
                    </span>
                    <span className={styles.appBody}>
                      <span className={styles.appOutlet}>{item.outlet}</span>
                      <span className={styles.appTitle}>{item.title}</span>
                      {item.excerpt && <span className={styles.appExcerpt}>{item.excerpt}</span>}
                    </span>
                    <span className={styles.appDate}>{formatDate(item.date)}</span>
                    <span className={styles.appArrow}>
                      <RiArrowRightUpLine size={20} />
                    </span>
                  </a>
                </li>
              )
            })}
          </ul>
        </div>
      </section>

      {/* ===== Releases / Downloads ===== */}
      <section className={styles.releases}>
        <div className={styles.releasesInner}>
          <h2 className={styles.sectionHeadline}>Press releases</h2>

          <ul className={styles.releaseList}>
            {PRESS_RELEASES.map((release) => (
              <li key={release.id} className={styles.releaseRow}>
                <a href={release.pdfUrl} className={styles.releaseLink} download>
                  <span className={styles.releaseId}>{release.id}</span>
                  <span className={styles.releaseIcon}>
                    <RiFileTextLine size={20} />
                  </span>
                  <span className={styles.releaseBody}>
                    <span className={styles.releaseTitle}>{release.title}</span>
                    <span className={styles.releaseMeta}>
                      Edition {release.edition} · {release.language} · {release.pages} pages · PDF,{' '}
                      {release.size}
                    </span>
                  </span>
                  <span className={styles.releaseAction}>
                    <RiDownloadLine size={18} />
                    Download
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ===== Press Contact ===== */}
      <section className={styles.contact}>
        <div className={styles.contactInner}>
          <h2 className={styles.contactTitle}>
            Talking to <span className={shared.accent}>the press</span>
          </h2>
          <p className={styles.contactBody}>
            For interviews, image requests at print resolution, accreditation, or anything else
            editorial — write to the press desk. Replies usually within 48 hours.
          </p>

          {/* TODO: replace with real press contact details */}
          <dl className={styles.contactDl}>
            <div className={styles.contactDlRow}>
              <dt>Email</dt>
              <dd>
                <a href="mailto:press@zsb.ro">press@zsb.ro</a>
              </dd>
            </div>
            <div className={styles.contactDlRow}>
              <dt>Phone</dt>
              <dd>+40 700 000 000</dd>
            </div>
            <div className={styles.contactDlRow}>
              <dt>Contact</dt>
              <dd>Aurora Cârstea — Communication & PR</dd>
            </div>
          </dl>
        </div>
      </section>
    </main>
  )
}
