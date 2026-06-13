import type { AnchorHTMLAttributes, ElementType } from 'react'
import { cx } from 'styled-system/css'
import { type TextLinkVariantProps, textLink } from 'styled-system/recipes'

/**
 * TextLink — unified inline link primitive (ZSB-71).
 *
 * Replaces the Footer underline-draw link, the FeaturedEvents bottom-border
 * link, and the MagneticButton "secondary". `underline` (draw|border|quiet)
 * lives in the Panda `textLink` recipe. Pass `as={Link}` for next/link.
 */
type TextLinkProps = TextLinkVariantProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    /** Render element — defaults to an anchor; pass next/link's `Link`. */
    as?: ElementType
  }

export function TextLink({ underline, className, as: Tag = 'a', ...rest }: TextLinkProps) {
  return <Tag className={cx(textLink({ underline }), className)} {...rest} />
}
