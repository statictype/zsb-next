import { RiArrowRightUpLine } from '@remixicon/react'
import Link from 'next/link'
import { cx } from 'styled-system/css'
import type { RecipeVariantProps } from 'styled-system/types'
import { EditionTheme } from '@/components/EditionTheme/EditionTheme'
import { Figure } from '@/components/Figure/Figure'
import { Badge } from '@/components/ui/Badge/Badge'
import { Card } from '@/components/ui/Card/Card'
import type { Edition } from '@/types/edition'
import { editionCard } from './EditionCard.recipe'

/** The slice of `Edition` the archive card reads. Derived with `Pick` so it
 *  can't drift from the domain type — a fetched `Edition` satisfies it
 *  structurally and passes straight through. `dateTape` already composes
 *  "date · venue", so the card doesn't need `venueLine` separately. */
export type EditionCardData = Pick<
  Edition,
  'year' | 'theme' | 'themeHighlight' | 'dateTape' | 'heroImage' | 'thumbImage'
>

/** Bound to the recipe's variants: renaming or removing a size there
 *  resurfaces here as a type error, not a silently ignored prop. */
type EditionCardSize = NonNullable<RecipeVariantProps<typeof editionCard>>['size']

interface EditionCardProps {
  edition: EditionCardData
  href: string
  size?: EditionCardSize
  /** Entrance delay forwarded to the theme tape (the archive grid's
   *  `--card-index` stagger). */
  themeDelay?: string | undefined
  className?: string | undefined
}

/**
 * The archive edition card (/editions): image, year badge, theme tape, an
 * unlabeled date/venue line, and a decorative "View edition" cue. Always a
 * live link — upcoming editions never reach the archive grid (their pages
 * are gated `status != "upcoming"`). The imageless plate in the footer rail
 * is `EditionRailCard`, which shares the `EditionTheme` tape, not this card.
 */
export function EditionCard({
  edition,
  href,
  size = 'md',
  themeDelay,
  className,
}: EditionCardProps) {
  const styles = editionCard({ size })
  // `dateTape` is composed as "date · venue"; keep the venue name intact as
  // one wrap unit so a narrow card breaks before it, not inside it.
  const [date, venue] = edition.dateTape.split(' · ')

  return (
    <Card as={Link} href={href} ground="onDark" interactive className={cx(styles.root, className)}>
      <div className={styles.media}>
        <Figure
          image={edition.thumbImage ?? edition.heroImage}
          sizes={
            size === 'lg' ? '(min-width: 1440px) 1400px, 100vw' : '(min-width: 1024px) 50vw, 100vw'
          }
          className={styles.image}
        />
        <Badge className={styles.year}>{edition.year}</Badge>
      </div>
      <div className={styles.content}>
        <EditionTheme
          as="h2"
          size={size === 'lg' ? 'large' : 'normal'}
          interactive
          theme={edition.theme}
          themeHighlight={edition.themeHighlight}
          delay={themeDelay}
        />
        <div className={styles.meta}>
          <span className={styles.details}>
            {venue ? (
              <>
                {date} · <span className={styles.venue}>{venue}</span>
              </>
            ) : (
              edition.dateTape
            )}
          </span>
          <span className={styles.cta} aria-hidden>
            View edition
            <RiArrowRightUpLine size={16} className={styles.ctaIcon} />
          </span>
        </div>
      </div>
    </Card>
  )
}
