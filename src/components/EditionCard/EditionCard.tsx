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
 *  structurally and passes straight through. */
export type EditionCardData = Pick<
  Edition,
  | 'year'
  | 'theme'
  | 'themeHighlight'
  | 'dateTape'
  | 'artists'
  | 'venueLine'
  | 'heroImage'
  | 'thumbImage'
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
 * The archive edition card (/editions): image, year badge, theme tape, and a
 * date/artists/venue meta row. Always a live link — upcoming editions never
 * reach the archive grid (their pages are gated `status != "upcoming"`). The
 * imageless plate in the footer rail is `EditionRailCard`, which shares the
 * `EditionTheme` tape, not this card.
 */
export function EditionCard({
  edition,
  href,
  size = 'md',
  themeDelay,
  className,
}: EditionCardProps) {
  const styles = editionCard({ size })
  const artistCount = edition.artists.length
  const meta = [
    { label: 'Date', value: edition.dateTape.split(' · ')[0] },
    { label: 'Artists', value: `${artistCount} ${artistCount === 1 ? 'artist' : 'artists'}` },
    { label: 'Location', value: edition.venueLine },
  ].filter((entry): entry is { label: string; value: string } => Boolean(entry.value))

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
        {meta.length > 0 ? (
          <dl className={styles.meta} aria-label={`${edition.year} edition details`}>
            {meta.map(({ label, value }) => (
              <div key={label} className={styles.metaItem}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        ) : null}
      </div>
    </Card>
  )
}
