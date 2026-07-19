'use client'

import { usePathname } from 'next/navigation'
import { Carousel } from '@/components/Carousel/Carousel'
import { EditionRailCard } from '@/components/EditionsNav/EditionRailCard'
import { editionsNav } from '@/components/EditionsNav/EditionsNav.recipe'
import type { EditionListItem } from '@/sanity/lib/editions'

const styles = editionsNav()

export type EditionEntry = Pick<EditionListItem, 'year' | 'theme' | 'themeHighlight' | 'href'>

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
          const placement = edition.href
            ? ({
                status: pathname === edition.href ? 'current' : 'live',
                href: edition.href,
              } as const)
            : ({ status: 'announced' } as const)
          return {
            id: String(edition.year),
            content: <EditionRailCard edition={edition} {...placement} className={styles.card} />,
          }
        })}
      />
    </section>
  )
}
