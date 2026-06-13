import type { ElementType, HTMLAttributes } from 'react'
import { cx } from 'styled-system/css'
import { type CardVariantProps, card } from 'styled-system/recipes'

/**
 * Card — base contained-surface shell (ZSB-71).
 *
 * Backs the FeaturedEvents poster frame, the EditionsNav hairline box, and the
 * IsdayBadge surface. `surface` (bare|dark|light) × `interactive` live in the
 * Panda `card` recipe. Pass `as={Link}` (with `href`) for a navigable card;
 * per-consumer hover motion stays on the consumer via `className`.
 */
type CardProps = CardVariantProps &
  HTMLAttributes<HTMLElement> & {
    /** Render element — defaults to a `div`; pass next/link's `Link` for a card link. */
    as?: ElementType
    /** Set when rendering as an anchor / next-link card. */
    href?: string
  }

export function Card({ surface, interactive, className, as: Tag = 'div', ...rest }: CardProps) {
  return <Tag className={cx(card({ surface, interactive }), className)} {...rest} />
}
