import type { ElementType, ReactNode } from 'react'
import { cx } from 'styled-system/css'
import { type EyebrowVariantProps, eyebrow } from 'styled-system/recipes'

/**
 * Eyebrow — unified kicker/label primitive (ZSB-71).
 *
 * Replaces `.eyebrowMuted` (Shared.module.css), the StripControls eyebrow, and
 * the FeaturedEvents eyebrow. Variants (`tone` × `size` × `rule`) live in the
 * Panda `eyebrow` recipe, not in per-component CSS.
 */
type EyebrowProps = EyebrowVariantProps & {
  children: ReactNode
  className?: string
  /** Render element — defaults to a paragraph. */
  as?: ElementType
}

export function Eyebrow({ children, className, as: Tag = 'p', ...variants }: EyebrowProps) {
  return <Tag className={cx(eyebrow(variants), className)}>{children}</Tag>
}
