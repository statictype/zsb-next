import {
  cloneElement,
  type ElementType,
  type HTMLAttributes,
  isValidElement,
  type ReactElement,
} from 'react'
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
 *
 * With **`asChild`** it renders *as* its single child instead — merging the
 * card className onto the call site's own element (no wrapper, no nested-
 * interactive), for element-specific props (`target`/`rel` on an external
 * `<a>`) that `as`/`href` don't type. Mirrors Button's `asChild`.
 */
type CardOwnProps = CardVariantProps & { className?: string | undefined }

type CardAsProps = CardOwnProps &
  HTMLAttributes<HTMLElement> & {
    asChild?: false | undefined
    /** Render element — defaults to a `div`; pass next/link's `Link` for a card link. */
    as?: ElementType
    /** Set when rendering as an anchor / next-link card. */
    href?: string
  }

type CardAsChildProps = CardOwnProps & {
  asChild: true
  children: ReactElement<{ className?: string | undefined }>
}

type CardProps = CardAsProps | CardAsChildProps

export function Card({ ground, interactive, className, asChild, ...rest }: CardProps) {
  const cls = cx(card({ ground, interactive }), className)
  if (asChild && isValidElement(rest.children)) {
    const child = rest.children as ReactElement<{ className?: string }>
    return cloneElement(child, { className: cx(cls, child.props.className) })
  }
  const { as: Tag = 'div', ...domProps } = rest as CardAsProps
  return <Tag className={cls} {...domProps} />
}
