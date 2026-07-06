import { RiArrowRightUpLine } from '@remixicon/react'
import { cx } from 'styled-system/css'
import { card, section } from 'styled-system/recipes'
import { Badge } from '@/components/ui/Badge/Badge'
import { SectionHeading } from '@/components/ui/SectionHeading/SectionHeading'
import { splitFirstMatch } from '@/lib/split-first-match'
import type { ExternalGalleryData } from '@/types/edition'
import { externalGallery } from './ExternalGallery.recipe'

const styles = externalGallery()

interface ExternalGalleryProps {
  gallery: ExternalGalleryData
  theme: string
}

export function ExternalGallery({ gallery, theme }: ExternalGalleryProps) {
  const { tag, title, highlight, description, linkLabel, href } = gallery
  const titleParts = highlight ? splitFirstMatch(title, highlight) : null

  return (
    <section className={cx(section({ ground: 'dark' }), styles.section)}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <SectionHeading flush>Archive</SectionHeading>
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

              <SectionHeading as="h3" flush>
                {titleParts ? (
                  <>
                    {titleParts.before}
                    <span className={styles.titleHighlight}>{titleParts.match}</span>
                    {titleParts.after}
                  </>
                ) : (
                  title
                )}
              </SectionHeading>

              <p className={styles.description}>{description}</p>

              <div className={styles.cta}>
                <span className={styles.ctaLabel}>{linkLabel}</span>
                <span aria-hidden>
                  <RiArrowRightUpLine size={18} />
                </span>
                <span className={styles.ctaUrl}>{prettyHost(href)}</span>
              </div>
            </div>

            {/* Quiet edition plate — the old animated monogram, stripped of every
              gradient and the drifting grid. Solid type on a hairline panel. */}
            <div className={styles.cardRight} aria-hidden>
              <div className={styles.plate}>
                <div data-part="monogram">
                  <span data-part="zsb">ZSB</span>
                  <span data-part="year">2021</span>
                </div>
                <div data-part="meta">
                  <span>Edition 01</span>
                  <span>Digital</span>
                </div>
              </div>
            </div>
          </div>
        </a>
      </div>
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
