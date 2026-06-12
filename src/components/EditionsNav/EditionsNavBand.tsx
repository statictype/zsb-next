'use client'

import { RiArrowRightUpLine } from '@remixicon/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import styles from './EditionsNav.module.css'

export interface EditionEntry {
  year: number
  theme: string
  status: 'upcoming' | 'live'
}

/**
 * The presentational band: an archival register of editions ruled into a
 * hairline grid. Live plates render server-truthful `<Link>`s (crawlable even
 * before the entrance plays); upcoming editions show as non-clickable "Soon"
 * plates (their route is gated `status != "upcoming"`). A one-shot
 * IntersectionObserver toggles `data-revealed` so the staggered fade-up fires
 * when the band scrolls into view, not on load (it sits below the fold).
 */
export function EditionsNavBand({ editions }: { editions: EditionEntry[] }) {
  const pathname = usePathname()
  const ref = useRef<HTMLElement>(null)
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') {
      setRevealed(true)
      return
    }
    const io = new IntersectionObserver(
      (entries, obs) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setRevealed(true)
            obs.disconnect()
            break
          }
        }
      },
      { rootMargin: '0px 0px -15% 0px', threshold: 0.1 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <section ref={ref} className={styles.band} data-revealed={revealed} aria-label="ZSB editions">
      <ul className={styles.grid}>
        {editions.map((edition, i) => {
          const href = `/editions/${edition.year}`
          const isUpcoming = edition.status === 'upcoming'
          const isCurrent = !isUpcoming && pathname === href

          const inner = (
            <>
              <span className={styles.plateTop}>
                {isUpcoming ? (
                  <span className={styles.soon}>Soon</span>
                ) : isCurrent ? (
                  <span className={styles.viewing}>Viewing</span>
                ) : null}
                {!isUpcoming && !isCurrent && (
                  <RiArrowRightUpLine className={styles.arrow} size={18} aria-hidden />
                )}
              </span>

              <span className={styles.meta}>
                <span className={styles.year}>ZSB {edition.year}</span>
                <span className={styles.theme}>{edition.theme}</span>
              </span>
            </>
          )

          return (
            <li
              key={edition.year}
              className={styles.cell}
              style={{ ['--i']: i } as React.CSSProperties}
            >
              {isUpcoming ? (
                <div className={styles.plate} data-upcoming>
                  {inner}
                </div>
              ) : (
                <Link
                  href={href}
                  className={styles.plate}
                  data-current={isCurrent || undefined}
                  aria-current={isCurrent ? 'page' : undefined}
                >
                  {inner}
                </Link>
              )}
            </li>
          )
        })}
      </ul>
    </section>
  )
}
