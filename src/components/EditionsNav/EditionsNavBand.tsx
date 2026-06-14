'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { cx } from 'styled-system/css'
import { card } from 'styled-system/recipes'
import { StripControls } from '@/components/StripControls/StripControls'
import { useScrollSnapStrip } from '@/lib/use-scroll-snap-strip'
import styles from './EditionsNav.module.css'

export interface EditionEntry {
  year: number
  theme: string
  status: 'upcoming' | 'live'
}

/**
 * The editions strip: a horizontally drag-/scroll-snapping band of compact
 * cards with the shared StripControls header (eyebrow + prev/next arrows), the
 * same machinery as the edition carousel and media kit. Pairs with the footer
 * below it — pure
 * black, hairline-boxed, no solid fills. Cards are the unified `card` recipe
 * (ZSB-71): live cards link to their edition and take the shared hover (the
 * hairline warms to the accent); upcoming editions are non-clickable "Soon"
 * cards (their route is gated `status != "upcoming"`); the edition you're
 * viewing keeps a persistent chartreuse hairline and is inert. A one-shot
 * IntersectionObserver toggles `data-revealed` so the cards stagger in when the
 * strip scrolls into view (it's below the fold).
 */
export function EditionsNavBand({ editions }: { editions: EditionEntry[] }) {
  const pathname = usePathname()
  const sectionRef = useRef<HTMLElement>(null)
  const [revealed, setRevealed] = useState(false)
  const { trackRef, activeIndex, registerItem, goPrev, goNext, trackProps, guardClick } =
    useScrollSnapStrip<HTMLElement>({ count: editions.length })

  useEffect(() => {
    const el = sectionRef.current
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
      { rootMargin: '0px 0px -10% 0px', threshold: 0.1 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className={styles.band} data-revealed={revealed}>
      <StripControls
        eyebrow="Our journey"
        activeIndex={activeIndex}
        count={editions.length}
        onPrev={goPrev}
        onNext={goNext}
        labels={{ prev: 'Previous editions', next: 'Next editions' }}
      />
      <div className={styles.viewport}>
        <div
          ref={trackRef}
          className={styles.track}
          tabIndex={0}
          role="region"
          aria-label="ZSB editions"
          {...trackProps}
        >
          {editions.map((edition, i) => {
            const href = `/editions/${edition.year}`
            const isUpcoming = edition.status === 'upcoming'
            const isCurrent = !isUpcoming && pathname === href
            const style = { ['--i']: i } as React.CSSProperties
            // Unified card recipe + the strip's layout-local class. Only a live,
            // non-current edition is interactive (hairline → accent on hover);
            // current and upcoming are inert (current keeps a chartreuse hairline).
            const cardClass = cx(
              card({ ground: 'onDark', interactive: !isUpcoming && !isCurrent }),
              styles.card,
            )

            const inner = (
              <>
                <span className={styles.cardTop}>
                  {isUpcoming ? (
                    <span className={styles.soon}>Soon</span>
                  ) : isCurrent ? (
                    <span className={styles.viewing}>Viewing</span>
                  ) : null}
                </span>
                <span className={styles.meta}>
                  <span className={styles.year}>ZSB {edition.year}</span>
                  <span className={styles.theme}>{edition.theme}</span>
                </span>
              </>
            )

            return isUpcoming ? (
              <div
                key={edition.year}
                ref={registerItem(i)}
                className={cardClass}
                style={style}
                data-upcoming
              >
                {inner}
              </div>
            ) : (
              <Link
                key={edition.year}
                ref={registerItem(i)}
                href={href}
                className={cardClass}
                style={style}
                data-current={isCurrent || undefined}
                aria-current={isCurrent ? 'page' : undefined}
                draggable={false}
                onClick={guardClick(() => {})}
              >
                {inner}
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
