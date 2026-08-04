import { RiArrowRightUpLine } from '@remixicon/react'
import Link from 'next/link'
import { Fragment } from 'react'
import { cx } from 'styled-system/css'
import { Text } from 'styled-system/jsx'
import type { RecipeVariantProps } from 'styled-system/types'
import { editionCard } from '@/components/EditionCard/EditionCard.recipe'
import { EditionTheme } from '@/components/EditionTheme/EditionTheme'
import { Figure } from '@/components/Figure/Figure'
import type { Edition } from '@/types/edition'

export type EditionCardData = Pick<
  Edition,
  'year' | 'theme' | 'themeHighlight' | 'venueLine' | 'heroImage' | 'thumbImage'
> & {
  href: string
  dateSpan: string
  artistCount: number
  eventCount: number
}

/** Bound to the recipe's variants: renaming or removing one there resurfaces
 *  here as a type error, not a silently ignored prop. */
type EditionCardMedia = NonNullable<RecipeVariantProps<typeof editionCard>>['media']

interface EditionCardProps {
  edition: EditionCardData
  href: string
  media?: EditionCardMedia
  className?: string | undefined
}

const PLATE_SIZES = '(min-width: 1024px) 48vw, 100vw'

export function EditionCard({ edition, href, media = 'left', className }: EditionCardProps) {
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
        <Figure
          image={edition.thumbImage ?? edition.heroImage}
          sizes={PLATE_SIZES}
          className={styles.image}
        />
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
        </div>

        <span className={styles.arrow} aria-hidden>
          <RiArrowRightUpLine size={24} />
        </span>
      </div>
    </Link>
  )
}
