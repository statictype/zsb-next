import type { ReactNode } from 'react'
import { cx } from 'styled-system/css'
import { type EyebrowVariantProps, eyebrow } from 'styled-system/recipes'

/**
 * Eyebrow — unified kicker/label primitive (ZSB-71).
 *
 * The one kicker/label used above section headings. Variants (`tone` × `size` ×
 * `rule`) live in the Panda `eyebrow` recipe.
 */
type EyebrowProps = EyebrowVariantProps & {
  children: ReactNode
  className?: string | undefined
}

export function Eyebrow({ children, className, ...variants }: EyebrowProps) {
  return <p className={cx(eyebrow(variants), className)}>{children}</p>
}
