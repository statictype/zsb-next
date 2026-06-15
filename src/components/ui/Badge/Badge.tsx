import type { ElementType, ReactNode } from 'react'
import { cx } from 'styled-system/css'
import { type BadgeVariantProps, badge } from 'styled-system/recipes'

/**
 * Badge — unified tag/chip/badge primitive (ZSB-71).
 *
 * The one small tag/chip/badge used across the site (Hero tape labels,
 * FeaturedEvents/Calendar chips, the editions year tag, IsdayBadge, …). Visual
 * variants live in the Panda `badge` recipe (`tone` × `size` × `elevated`).
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
