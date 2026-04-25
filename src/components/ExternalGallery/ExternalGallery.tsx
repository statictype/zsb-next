import { RiArrowRightUpLine } from '@remixicon/react'
import sharedStyles from '@/components/Shared.module.css'
import type { ExternalGalleryData } from '@/types/edition'
import styles from './ExternalGallery.module.css'

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
    <section className={`${sharedStyles.section} ${sharedStyles.sectionDark} ${styles.section}`}>
      <div className={styles.field} aria-hidden>
        <div className={styles.grid} />
        <div className={styles.glow} />
      </div>

      <div className={styles.header}>
        <h2 className={sharedStyles.sectionTitle}>Archive</h2>
        <div className={styles.count}>{theme}</div>
      </div>

      <a
        className={styles.card}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${linkLabel} — opens ${href} in a new tab`}
      >
        <div className={styles.cardInner}>
          <div className={styles.cardLeft}>
            <span className={styles.tag}>
              <span className={styles.tagDot} aria-hidden />
              {tag}
            </span>

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
              <span className={styles.ctaIcon}>
                <RiArrowRightUpLine size={20} />
              </span>
              <span className={styles.ctaUrl}>{prettyHost(href)}</span>
            </div>
          </div>

          <div className={styles.cardRight} aria-hidden>
            <div className={styles.frame}>
              <div className={styles.framePattern} />
              <div className={styles.frameMonogram}>
                <span>ZSB</span>
                <span>2021</span>
              </div>
              <div className={styles.frameMeta}>
                <span>EDITION 01</span>
                <span>DIGITAL</span>
              </div>
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
