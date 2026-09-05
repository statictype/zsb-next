import type { ReactNode } from 'react'
import { cx } from 'styled-system/css'
import { tooltip } from 'styled-system/recipes'

type TooltipProps = {
  label: string
  children: ReactNode
  className?: string | undefined
}

export function Tooltip({ label, children, className }: TooltipProps) {
  const styles = tooltip()
  return (
    <span data-tooltip className={cx(styles.root, className)} tabIndex={0}>
      {children}
      <span className={styles.bubble}>{label}</span>
    </span>
  )
}
