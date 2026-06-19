import type { ReactNode } from 'react'
import { cx } from 'styled-system/css'
import { sectionHeading } from './SectionHeading.recipe'

interface SectionHeadingProps {
  /** Heading level — defaults to `h2`. */
  as?: 'h2' | 'h3' | undefined
  /** `upper` (the `sectionTitle` uppercase default) or `sentence`. */
  case?: 'upper' | 'sentence' | undefined
  /** Drop the bottom margin (0) when a parent header owns the title→content gap.
   *  Defaults to the standard `xl`. */
  flush?: boolean | undefined
  /** Anchor id (e.g. an `aria-labelledby` target). */
  id?: string | undefined
  /** cx escape for true layout only — `maxWidth`, `gridArea`, etc. */
  className?: string | undefined
  children: ReactNode
}

/**
 * The shared section title. See `SectionHeading.recipe.ts` for the baked
 * defaults; color is inherited from the section ground.
 */
export function SectionHeading({
  as: Tag = 'h2',
  case: textCase = 'upper',
  flush = false,
  id,
  className,
  children,
}: SectionHeadingProps) {
  return (
    <Tag id={id} className={cx(sectionHeading({ case: textCase, flush }), className)}>
      {children}
    </Tag>
  )
}
