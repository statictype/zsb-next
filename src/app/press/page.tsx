import {
  RiArrowRightUpLine,
  RiNewspaperLine,
  RiPlayCircleLine,
  RiSoundcloudLine,
  RiVimeoLine,
  RiYoutubeLine,
} from '@remixicon/react'
import type { Metadata } from 'next'
import { MediaKitStrip } from '@/components/MediaKitStrip/MediaKitStrip'
import shared from '@/components/Shared.module.css'
import { MEDIA_KIT } from '@/data/media-kit'
import { PRESS_APPEARANCES, type PressAppearanceType } from '@/data/press-appearances'
import styles from './page.module.css'

export const metadata: Metadata = {
  title: 'Press',
  description:
    'Press kit, official posters, releases, and media coverage for Bucharest Sculpture Days — across every edition.',
  alternates: { canonical: '/press' },
}

const TYPE_META: Record<PressAppearanceType, { label: string; Icon: typeof RiYoutubeLine }> = {
  youtube: { label: 'Video', Icon: RiYoutubeLine },
  vimeo: { label: 'Video', Icon: RiVimeoLine },
  soundcloud: { label: 'Audio', Icon: RiSoundcloudLine },
  article: { label: 'Article', Icon: RiNewspaperLine },
  tv: { label: 'Broadcast', Icon: RiPlayCircleLine },
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
          <p className={shared.lead}>
            A reference desk for editors, reporters, and curators. Posters, releases, and media
            coverage from every edition since 2021.
          </p>
        </div>
      </section>

      {/* ===== Media Kit Strip ===== */}
      <section id="media-kit" className={styles.kitSection}>
        <div className={styles.kitHeader}>
          <h2 className={`${shared.sectionTitle} ${styles.kitTitle}`}>Media kit</h2>
        </div>

        <MediaKitStrip items={MEDIA_KIT} />
      </section>

      {/* ===== Appearances ===== */}
      <section className={styles.appearances}>
        <div className={styles.appearancesInner}>
          <h2 className={shared.sectionTitle}>Press appearances</h2>

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
    </main>
  )
}
