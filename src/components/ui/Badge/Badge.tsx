import type { ReactNode } from 'react'
import { cx } from 'styled-system/css'
import { Text } from 'styled-system/jsx'
import { type BadgeVariantProps, badge } from 'styled-system/recipes'

/**
 * Badge — unified tag/chip/badge primitive (ZSB-71).
 *
 * The one small tag/chip/badge used across the site (Hero tape labels,
 * FeaturedEvents/Calendar chips, the editions year tag, IsdayBadge, …). Visual
 * variants live in the Panda `badge` recipe (`tone` only).
 */
type BadgeProps = BadgeVariantProps & {
  children: ReactNode
  className?: string | undefined
}

export function Badge({ children, className, ...variants }: BadgeProps) {
  return (
    <Text variant="label" className={cx(badge(variants), className)}>
      {children}
    </Text>
  )
}
