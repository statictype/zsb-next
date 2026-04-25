import { RiArrowRightUpLine } from '@remixicon/react'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import type { CSSProperties } from 'react'
import shared from '@/components/Shared.module.css'
import { getAllEditionYears, getEdition } from '@/data/editions'
import { isOnlineEdition } from '@/types/edition'
import styles from './page.module.css'

export const metadata: Metadata = {
  title: 'Editions',
  description: 'Every edition of Bucharest Sculpture Days, from 2021 to today.',
  alternates: { canonical: '/editions' },
}

export default function EditionsPage() {
  const years = getAllEditionYears()

  return (
    <main>
      <section className={`${shared.section} ${shared.sectionDark} ${styles.main}`}>
        <div className={shared.sectionInner}>
          <header className={styles.header}>
            <h1 className={shared.pageTitle}>
              Edition<span className={shared.accent}>s</span>
            </h1>
            <p className={shared.lead}>
              Every edition of Bucharest Sculpture Days, from 2021 to today.
            </p>
          </header>

          <div className={styles.grid}>
            {years.map((year, index) => {
              const edition = getEdition(year)
              if (!edition) return null
              const isFeature = index === 0
              const online = isOnlineEdition(edition)
              const thumb = online
                ? null
                : (edition.carousel[0]?.images[0]?.image ?? edition.heroImage)

              return (
                <Link
                  key={year}
                  href={`/editions/${year}`}
                  className={styles.card}
                  style={{ '--card-index': index } as CSSProperties}
                >
                  <div className={styles.frame}>
                    {thumb ? (
                      <Image
                        src={thumb.src}
                        alt={thumb.alt}
                        fill
                        sizes={
                          isFeature
                            ? '(min-width: 1440px) 1400px, 100vw'
                            : '(min-width: 1024px) 50vw, 100vw'
                        }
                        className={styles.thumbImg}
                      />
                    ) : (
                      <div className={styles.thumbPlaceholder} aria-hidden>
                        <div className={styles.thumbPlaceholderGrid} />
                        <div className={styles.thumbPlaceholderMark}>
                          <span>{edition.theme}</span>
                          <span>Online · {year}</span>
                        </div>
                      </div>
                    )}
                    <span className={styles.yearTag}>
                      <span className={styles.yearDot} aria-hidden />
                      <span className={styles.yearText}>{year}</span>
                    </span>
                  </div>

                  <div className={styles.meta}>
                    <div className={styles.metaText}>
                      <h2 className={styles.theme}>{edition.theme}</h2>
                      <div className={styles.subline}>
                        <span>{edition.artists.length} artists</span>
                        <span className={styles.sublineDot} aria-hidden />
                        <span>{edition.dateTape}</span>
                      </div>
                    </div>

                    <span className={styles.cta}>
                      <span>Explore</span>
                      <RiArrowRightUpLine size={16} />
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>
    </main>
  )
}
