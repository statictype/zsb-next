import { RiArrowRightUpLine } from '@remixicon/react'
import Link from 'next/link'
import { type CSSProperties } from 'react'
import { cx } from 'styled-system/css'
import { DraftAware } from '@/components/DraftAware/DraftAware'
import { Figure } from '@/components/Figure/Figure'
import shared from '@/components/Shared.module.css'
import { Card } from '@/components/ui/Card/Card'
import { TextLink } from '@/components/ui/TextLink/TextLink'
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
  // Filter nulls (e.g. upcoming editions hidden from the list) BEFORE mapping, so
  // index 0 is the first *visible* edition — the latest live one gets the feature
  // treatment regardless of how many hidden years precede it.
  const visibleEditions = editions.filter((edition) => edition != null)

  return (
    <EditionsListShell>
      <div className={styles.grid}>
        {visibleEditions.map((edition, index) => {
          const year = edition.year
          const isFeature = index === 0
          const thumb = edition.thumbImage ?? edition.heroImage

          return (
            <div
              key={year}
              className={cx(styles.slot, isFeature && styles.feature)}
              style={{ '--card-index': index } as CSSProperties}
            >
              <Card
                as={Link}
                href={`/editions/${year}`}
                ground="onDark"
                interactive
                className={styles.card}
              >
                <div className={styles.frame}>
                  <Figure
                    image={thumb}
                    sizes={
                      isFeature
                        ? '(min-width: 1440px) 1400px, 100vw'
                        : '(min-width: 1024px) 50vw, 100vw'
                    }
                    className={styles.thumbImg}
                  />
                  <span className={styles.yearTag}>{year}</span>
                </div>

                <div className={styles.meta}>
                  <h2 className={styles.theme}>{edition.theme}</h2>
                  <div className={styles.metaFoot}>
                    <span className={styles.subline}>
                      <span>{edition.artists.length} artists</span>
                      <span className={styles.sublineDot} aria-hidden />
                      <span>{edition.dateTape}</span>
                    </span>
                    <TextLink as="span" underline="quiet" className={styles.cta}>
                      Explore
                      <RiArrowRightUpLine size={16} />
                    </TextLink>
                  </div>
                </div>
              </Card>
            </div>
          )
        })}
      </div>
    </EditionsListShell>
  )
}

function EditionsListShell({ children }: { children?: React.ReactNode }) {
  return (
    <main>
      <section className={shared.pageHero}>
        <div className={shared.sectionInner}>
          <h1 className={shared.pageTitle}>
            Edition<span className={shared.accent}>s</span>
          </h1>
          <p className={shared.lead}>
            Five past editions. Five #, each one a curatorial position, not just a title. Together
            they trace a movement: from the space sculpture inhabits, to the emotional conditions it
            holds, to the forces it models, to the body it refuses to idealise. Not a plan. A
            conversation that keeps going.
          </p>
        </div>
      </section>

      <section className={`${shared.sectionDark} ${styles.list}`}>
        <div className={shared.sectionInner}>{children}</div>
      </section>
    </main>
  )
}
