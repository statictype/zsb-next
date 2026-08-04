import { RiArrowRightUpLine } from '@remixicon/react'
import Link from 'next/link'
import { Fragment } from 'react'
import { cx } from 'styled-system/css'
import { Text } from 'styled-system/jsx'
import type { RecipeVariantProps } from 'styled-system/types'
import { editionCard } from '@/components/EditionCard/EditionCard.recipe'
import { EditionTheme } from '@/components/EditionTheme/EditionTheme'
import { Figure } from '@/components/Figure/Figure'
import type { Edition, ImageData } from '@/types/edition'

export type EditionCardData = Pick<
  Edition,
  'year' | 'theme' | 'themeHighlight' | 'venueLine' | 'thumbImage'
> & {
  href: string
  dateSpan: string
  artistCount: number
  eventCount: number
  heroImage?: ImageData
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

  const counts: { value: number; unit: string }[] = []
  if (edition.artistCount > 0) {
    counts.push({
      value: edition.artistCount,
      unit: edition.artistCount === 1 ? 'artist' : 'artists',
    })
  }
  if (edition.eventCount > 0) {
    counts.push({ value: edition.eventCount, unit: edition.eventCount === 1 ? 'event' : 'events' })
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

        <div className={styles.meta}>
          {counts.length > 0 && (
            <Text as="span" variant="caption">
              {counts.map((count, index) => (
                <Fragment key={count.unit}>
                  {index > 0 ? ' · ' : null}
                  <span className={styles.count}>{count.value}</span> {count.unit}
                </Fragment>
              ))}
            </Text>
          )}
          {edition.dateSpan ? (
            <Text as="span" variant="caption">
              {edition.dateSpan}
            </Text>
          ) : null}
          {edition.venueLine ? (
            <Text as="span" variant="caption">
              {edition.venueLine}
            </Text>
          ) : null}

          <span className={styles.arrow} aria-hidden>
            <RiArrowRightUpLine size={24} />
          </span>
        </div>
      </div>
    </Link>
  )
}
