import { RiArrowRightUpLine } from '@remixicon/react'
import Link from 'next/link'
import { Fragment, type ReactNode } from 'react'
import { cx } from 'styled-system/css'
import { Text } from 'styled-system/jsx'
import type { RecipeVariantProps } from 'styled-system/types'
import { editionCard } from '@/components/EditionCard/EditionCard.recipe'
import { EditionTheme } from '@/components/EditionTheme/EditionTheme'
import { Figure } from '@/components/Figure/Figure'
import type { Edition, ImageData } from '@/types/edition'

export type EditionCardData = Pick<Edition, 'year' | 'theme' | 'themeHighlight' | 'thumbImage'> & {
  href: string
  dateSpan: string
  artistCount: number
  eventCount: number
  heroImage?: ImageData
  venueLine?: string
}

/** Bound to the recipe's variants: renaming or removing one there resurfaces
 *  here as a type error, not a silently ignored prop. */
type EditionCardMedia = NonNullable<RecipeVariantProps<typeof editionCard>>['media']

interface EditionCardProps {
  edition: EditionCardData
  href: string
  media?: EditionCardMedia
  preload?: boolean
  className?: string | undefined
}

// Read off tokens.ts: the container caps at maxWidth 1800 + 2×gutter 112, and
// the plate is then (1800 − gridGap 84) / 2. The last entry is the mobile
// thumbnail's own clamp ceiling, not a share of the viewport.
const PLATE_SIZES =
  '(min-width: 2024px) 858px, (min-width: 1024px) 48vw, (min-width: 768px) 90vw, 104px'

export function EditionCard({
  edition,
  href,
  media = 'left',
  preload = false,
  className,
}: EditionCardProps) {
  const styles = editionCard({ media })

  const count = (value: number, singular: string, plural: string) => (
    <>
      <span className={styles.count}>{value}</span> {value === 1 ? singular : plural}
    </>
  )

  const facts: { key: string; content: ReactNode }[] = []
  if (edition.dateSpan) {
    facts.push({ key: 'dates', content: edition.dateSpan })
  }
  if (edition.venueLine) {
    facts.push({ key: 'venue', content: edition.venueLine })
  }
  if (edition.artistCount > 0) {
    facts.push({ key: 'artists', content: count(edition.artistCount, 'artist', 'artists') })
  }
  if (edition.eventCount > 0) {
    facts.push({ key: 'events', content: count(edition.eventCount, 'event', 'events') })
  }

  return (
    <Link href={href} className={cx(styles.root, className)}>
      <span className={styles.plate}>
        <span className={styles.frame}>
          <Figure
            image={edition.thumbImage ?? edition.heroImage}
            sizes={PLATE_SIZES}
            preload={preload}
            className={styles.image}
          />
        </span>
      </span>

      <div className={styles.body}>
        <div className={styles.head}>
          <Text as="h2" variant="title" className={styles.title}>
            <span className={styles.prefix}>ZSB</span> {edition.year}
            <span className={styles.arrow} aria-hidden>
              <RiArrowRightUpLine size={24} />
            </span>
          </Text>
          <EditionTheme
            as="p"
            size="sub"
            interactive
            theme={edition.theme}
            themeHighlight={edition.themeHighlight}
            className={styles.theme}
          />
        </div>

        {facts.length > 0 && (
          <Text as="span" variant="caption" className={styles.meta}>
            {facts.map((fact, index) => (
              <Fragment key={fact.key}>
                {index > 0 ? ' · ' : null}
                {fact.content}
              </Fragment>
            ))}
          </Text>
        )}
      </div>
    </Link>
  )
}
