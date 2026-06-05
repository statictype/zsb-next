import { RiArrowRightUpLine } from '@remixicon/react'
import Image from 'next/image'
import Link from 'next/link'
import { type CSSProperties } from 'react'
import { DraftAware } from '@/components/DraftAware/DraftAware'
import shared from '@/components/Shared.module.css'
import { getAllEditionYears, getEdition } from '@/data/editions'
import { pageMetadata } from '@/lib/seo'
import { type DynamicFetchOptions } from '@/sanity/lib/live'
import styles from './page.module.css'

export const metadata = pageMetadata({
  title: 'Editions',
  description: 'Every edition of Bucharest Sculpture Days, from 2021 to today.',
  path: '/editions',
})

export default function EditionsPage() {
  return (
    <DraftAware
      cached={(options) => <CachedEditionsList options={options} />}
      fallback={<EditionsListShell />}
    />
  )
}

async function CachedEditionsList({ options }: { options: DynamicFetchOptions }) {
  'use cache'
  const years = await getAllEditionYears()
  const editions = await Promise.all(years.map(async (year) => getEdition(year, options)))

  return (
    <EditionsListShell>
      <div className={styles.grid}>
        {editions.map((edition, index) => {
          if (!edition) return null
          const year = edition.year
          const isFeature = index === 0
          const thumb = edition.thumbImage ?? edition.heroImage

          return (
            <Link
              key={year}
              href={`/editions/${year}`}
              className={styles.card}
              style={{ '--card-index': index } as CSSProperties}
            >
              <div className={styles.frame}>
                <span aria-hidden className={shared.skeleton} />
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
                  {...(thumb.blurDataURL
                    ? { placeholder: 'blur' as const, blurDataURL: thumb.blurDataURL }
                    : {})}
                />
                <span className={styles.yearTag}>{year}</span>
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
    </EditionsListShell>
  )
}

function EditionsListShell({ children }: { children?: React.ReactNode }) {
  return (
    <main>
      <section className={`${shared.section} ${shared.sectionDark} ${styles.main}`}>
        <div className={shared.sectionInner}>
          <header className={styles.header}>
            <h1 className={shared.pageTitle}>
              Edition<span className={shared.accent}>s</span>
            </h1>
            <p className={shared.lead}>
              Five past editions. Five #, each one a curatorial position, not just a title. Together
              they trace a movement: from the space sculpture inhabits, to the emotional conditions
              it holds, to the forces it models, to the body it refuses to idealise. Not a plan. A
              conversation that keeps going.
            </p>
          </header>
          {children}
        </div>
      </section>
    </main>
  )
}
