import { RiArrowRightUpLine } from '@remixicon/react'
import Link from 'next/link'
import { cx } from 'styled-system/css'
import { Divider, HStack, Stack, Text } from 'styled-system/jsx'
import type { RecipeVariantProps } from 'styled-system/types'
import { EditionTheme } from '@/components/EditionTheme/EditionTheme'
import { Figure } from '@/components/Figure/Figure'
import { Badge } from '@/components/ui/Badge/Badge'
import { Card } from '@/components/ui/Card/Card'
import type { Edition } from '@/types/edition'
import { editionCard } from './EditionCard.recipe'

/** The slice of `Edition` the archive card reads. Derived with `Pick` so it
 *  can't drift from the domain type — a fetched `Edition` satisfies it
 *  structurally and passes straight through. Both `dateTape` (composed
 *  "date · venue") and `venueLine` are read: the tape gives the date, the
 *  line gives the venue directly instead of re-parsing it back out. */
export type EditionCardData = Pick<
  Edition,
  'year' | 'theme' | 'themeHighlight' | 'dateTape' | 'venueLine' | 'heroImage' | 'thumbImage'
>

/** Bound to the recipe's variants: renaming or removing a size there
 *  resurfaces here as a type error, not a silently ignored prop. */
type EditionCardSize = NonNullable<RecipeVariantProps<typeof editionCard>>['size']

interface EditionCardProps {
  edition: EditionCardData
  href: string
  size?: EditionCardSize
  className?: string | undefined
}

/**
 * The archive edition card (/editions): image, year badge, theme tape, an
 * unlabeled date/venue line, and a decorative "View edition" cue. Always a
 * live link — upcoming editions never reach the archive grid (their pages
 * are gated `status != "upcoming"`). The imageless plate in the footer rail
 * is `EditionRailCard`, which shares the `EditionTheme` tape, not this card.
 */
export function EditionCard({ edition, href, size = 'md', className }: EditionCardProps) {
  const styles = editionCard({ size })
  // `dateTape` composes "date · venue"; split off just the date and read
  // `venueLine` directly for the venue, rather than re-parsing it back out.
  const date = edition.dateTape.split(' · ')[0]

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
      <Stack className={styles.content} gap="sm">
        <EditionTheme
          as="h2"
          size={size === 'lg' ? 'large' : 'normal'}
          interactive
          theme={edition.theme}
          themeHighlight={edition.themeHighlight}
        />
        <Divider />
        <HStack justify="space-between" paddingBlockStart="lg">
          <Text variant="label">
            {edition.venueLine ? (
              <>
                {date} · <span className={styles.venue}>{edition.venueLine}</span>
              </>
            ) : (
              edition.dateTape
            )}
          </Text>
          <HStack as="span" className={styles.cta} aria-hidden>
            <Text variant="label">View edition</Text>
            <RiArrowRightUpLine size={16} className={styles.ctaIcon} />
          </HStack>
        </HStack>
      </Stack>
    </Card>
  )
}
