'use client'

import { usePathname } from 'next/navigation'
import { type CSSProperties, useEffect, useRef, useState } from 'react'
import { Carousel } from '@/components/Carousel/Carousel'
import type { EditionListItem } from '@/sanity/lib/editions'
import { EditionRailCard, type RailPlacement } from './EditionRailCard'
import { editionsNav } from './EditionsNav.recipe'

const styles = editionsNav()

/** What the band reads off each edition — a strict slice of the data layer's
 *  `EditionListItem`, so the server side hands the fetched list over unmapped
 *  and the contract can't drift from the query shape. */
export type EditionEntry = Pick<EditionListItem, 'year' | 'theme' | 'themeHighlight' | 'status'>

/**
 * The editions rail: a horizontally draggable band of EditionRailCard plates
 * inside the shared Carousel. It pairs with the footer below it — pure black,
 * no boxed border. The band owns *placement*: it turns each entry's status +
 * the current pathname into a `RailPlacement` (live link / inert "Viewing" /
 * non-linked "Soon"), and the plate renders it. A one-shot
 * IntersectionObserver toggles `data-revealed` so the cards stagger in when
 * the strip scrolls into view (it's below the fold).
 */
export function EditionsNavBand({ editions }: { editions: EditionEntry[] }) {
  const pathname = usePathname()
  const sectionRef = useRef<HTMLElement>(null)
  const [revealed, setRevealed] = useState(false)

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
      <Carousel
        id="editions-navigation"
        label="ZSB editions"
        mode="rail"
        autoplay={false}
        loop={false}
        eyebrow="Our journey"
        slides={editions.map((edition, i) => {
          const href = `/editions/${edition.year}`
          const placement: RailPlacement =
            edition.status === 'upcoming'
              ? { status: 'upcoming' }
              : { status: pathname === href ? 'current' : 'live', href }
          return {
            id: String(edition.year),
            content: (
              <EditionRailCard
                edition={edition}
                {...placement}
                className={styles.card}
                style={{ '--i': i } as CSSProperties}
              />
            ),
          }
        })}
      />
    </section>
  )
}
