import type { ElementType, ReactNode } from 'react'
import { cx } from 'styled-system/css'
import { type BadgeVariantProps, badge } from 'styled-system/recipes'

/**
 * Badge — unified tag/chip/badge primitive (ZSB-71).
 *
 * Replaces the legacy one-offs: `.pill`/`.pillLg`, Hero tape labels,
 * FeaturedEvents `.chip`, Calendar chips, EditionsNav `.soon`/`.viewing`,
 * and the IsdayBadge pill. Visual variants live in the Panda `badge` recipe
 * (`tone` × `size` × `elevated`), not in per-component CSS.
 */
type BadgeProps = BadgeVariantProps & {
  children: ReactNode
  className?: string
  /** Render element — defaults to a span. */
  as?: ElementType
}

export function Badge({ children, className, as: Tag = 'span', ...variants }: BadgeProps) {
  return <Tag className={cx(badge(variants), className)}>{children}</Tag>
}
