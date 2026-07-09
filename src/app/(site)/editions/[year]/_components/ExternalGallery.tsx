import { RiArrowRightUpLine } from '@remixicon/react'
import { cx } from 'styled-system/css'
import { Container } from 'styled-system/jsx'
import { section } from 'styled-system/recipes'
import { Badge } from '@/components/ui/Badge/Badge'
import { Card } from '@/components/ui/Card/Card'
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
      <Container>
        <div className={styles.header}>
          <SectionHeading flush>Archive</SectionHeading>
          <div className={styles.count}>{theme}</div>
        </div>

        <Card asChild ground="onDark" interactive>
          <a
            className={styles.card}
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
        </Card>
      </Container>
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
