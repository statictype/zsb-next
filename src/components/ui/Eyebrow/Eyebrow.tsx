import type { ReactNode } from 'react'
import { cx } from 'styled-system/css'
import { Text } from 'styled-system/jsx'
import { type EyebrowVariantProps, eyebrow } from 'styled-system/recipes'

/**
 * Eyebrow — unified kicker/label primitive (ZSB-71).
 *
 * The one kicker/label used above section headings. Variants (`rule` only)
 * live in the Panda `eyebrow` recipe.
 */
type EyebrowProps = EyebrowVariantProps & {
  children: ReactNode
  className?: string | undefined
}

export function Eyebrow({ children, className, ...variants }: EyebrowProps) {
  return (
    <Text as="p" variant="label" className={cx(eyebrow(variants), className)}>
      {children}
    </Text>
  )
}
