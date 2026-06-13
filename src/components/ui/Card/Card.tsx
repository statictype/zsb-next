import type { ElementType, HTMLAttributes } from 'react'
import { cx } from 'styled-system/css'
import { type CardVariantProps, card } from 'styled-system/recipes'

/**
 * Card — the one unified card (ZSB-71).
 *
 * Every card on the site is a hairline-bordered surface (ZSB's signature).
 * `ground` (onDark|onLight) × `interactive` live in the Panda `card` recipe;
 * `interactive` adds the single shared hover (hairline → accent + lift). Pass
 * `as={Link}` (with `href`) for a navigable card; per-consumer motion
 * (title-colour, image zoom) stays on the consumer via `className`.
 */
type CardProps = CardVariantProps &
  HTMLAttributes<HTMLElement> & {
    /** Render element — defaults to a `div`; pass next/link's `Link` for a card link. */
    as?: ElementType
    /** Set when rendering as an anchor / next-link card. */
    href?: string
  }

export function Card({ ground, interactive, className, as: Tag = 'div', ...rest }: CardProps) {
  return <Tag className={cx(card({ ground, interactive }), className)} {...rest} />
}
