'use client'

import { usePathname } from 'next/navigation'
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
 * non-linked "Soon"), and the plate renders it.
 */
export function EditionsNavBand({ editions }: { editions: EditionEntry[] }) {
  const pathname = usePathname()

  return (
    <section className={styles.band}>
      <Carousel
        id="editions-navigation"
        label="ZSB editions"
        mode="rail"
        autoplay={false}
        loop={false}
        eyebrow="Our journey"
        slides={editions.map((edition) => {
          const href = `/editions/${edition.year}`
          const placement: RailPlacement =
            edition.status === 'upcoming'
              ? { status: 'upcoming' }
              : { status: pathname === href ? 'current' : 'live', href }
          return {
            id: String(edition.year),
            content: <EditionRailCard edition={edition} {...placement} className={styles.card} />,
          }
        })}
      />
    </section>
  )
}
