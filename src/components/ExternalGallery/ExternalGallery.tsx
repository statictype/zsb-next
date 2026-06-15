import { RiArrowRightUpLine } from '@remixicon/react'
import { css, cx } from 'styled-system/css'
import { card } from 'styled-system/recipes'
import { Badge } from '@/components/ui/Badge/Badge'
import type { ExternalGalleryData } from '@/types/edition'
import { externalGallery } from './ExternalGallery.recipe'

const styles = externalGallery()

interface ExternalGalleryProps {
  gallery: ExternalGalleryData
  theme: string
}

function splitOnFirst(a: string, b: string) {
  const [before, ...rest] = a.split(b)
  if (!rest.length || !before) return null
  return [before, rest.join(b)] as [string, string]
}

export function ExternalGallery({ gallery, theme }: ExternalGalleryProps) {
  const { tag, title, highlight, description, linkLabel, href } = gallery

  const [firstPart, secondPart] = highlight
    ? (splitOnFirst(title, highlight) ?? [title, ''])
    : [title, '']

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2 className={css({ textStyle: 'sectionTitle' })}>Archive</h2>
        <div className={styles.count}>{theme}</div>
      </div>

      {/* The unified hairline Card (ZSB-71) via the recipe directly — a raw
          external <a> (target/rel) that the <Card> wrapper's props don't cover. */}
      <a
        className={cx(card({ ground: 'onDark', interactive: true }), styles.card)}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${linkLabel} — opens ${href} in a new tab`}
      >
        <div className={styles.cardInner}>
          <div className={styles.cardLeft}>
            <Badge>{tag}</Badge>

            <h3 className={styles.title}>
              {highlight ? (
                <>
                  {firstPart}
                  <span className={styles.titleHighlight}>{highlight}</span>
                  {secondPart}
                </>
              ) : (
                title
              )}
            </h3>

            <p className={styles.description}>{description}</p>

            <div className={styles.cta}>
              <span className={styles.ctaLabel}>{linkLabel}</span>
              <span className={styles.ctaIcon} aria-hidden>
                <RiArrowRightUpLine size={18} />
              </span>
              <span className={styles.ctaUrl}>{prettyHost(href)}</span>
            </div>
          </div>

          {/* Quiet edition plate — the old animated monogram, stripped of every
              gradient and the drifting grid. Solid type on a hairline panel. */}
          <div className={styles.cardRight} aria-hidden>
            <div className={styles.plateMonogram}>
              <span className={styles.plateZsb}>ZSB</span>
              <span className={styles.plateYear}>2021</span>
            </div>
            <div className={styles.plateMeta}>
              <span>Edition 01</span>
              <span>Digital</span>
            </div>
          </div>
        </div>
      </a>
    </section>
  )
}

function prettyHost(href: string): string {
  try {
    const url = new URL(href)
    return `${url.host}${url.pathname.replace(/\/$/, '')}`
  } catch {
    return href
  }
}
