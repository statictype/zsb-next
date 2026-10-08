import type { ReactNode } from 'react'
import { cx } from 'styled-system/css'
import { type BadgeVariantProps, badge } from 'styled-system/recipes'

type BadgeProps = BadgeVariantProps & {
  children: ReactNode
  className?: string | undefined
}

export function Badge({ children, className, ...variants }: BadgeProps) {
  return <span className={cx(badge(variants), className)}>{children}</span>
}
