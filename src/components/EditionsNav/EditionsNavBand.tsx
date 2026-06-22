'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { Carousel } from '@/components/Carousel/Carousel'
import { EditionCard } from '@/components/EditionCard/EditionCard'
import { editionsNav } from './EditionsNav.recipe'

const styles = editionsNav()

export interface EditionEntry {
  year: number
  theme: string
  status: 'upcoming' | 'live'
}

/**
 * The editions rail: a horizontally draggable band of compact cards inside
 * the shared Carousel. It pairs with the footer below it — pure black,
 * hairline-boxed, no solid fills. Cards are the unified `card` recipe
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
          const isUpcoming = edition.status === 'upcoming'
          const isCurrent = !isUpcoming && pathname === href
          const style = { ['--i']: i } as React.CSSProperties
          const content = (
            <EditionCard
              year={edition.year}
              theme={edition.theme}
              status={isUpcoming ? 'upcoming' : isCurrent ? 'current' : 'live'}
              media="none"
              size="sm"
              href={isUpcoming ? undefined : href}
              className={styles.card}
              style={style}
              draggable={false}
            />
          )
          return { id: String(edition.year), content }
        })}
      />
    </section>
  )
}
