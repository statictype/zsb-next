import type { ButtonHTMLAttributes } from 'react'
import { cx } from 'styled-system/css'
import { type ButtonVariantProps, button } from 'styled-system/recipes'

/**
 * Button — unified action primitive (ZSB-71).
 *
 * Replaces MagneticButton's filled/outlined variants and CookieBanner's
 * solid/ghost buttons. Visual variants (`variant` × `size`) live in the Panda
 * `button` recipe. Magnetic/ripple behaviour (ZSB-74) and the text-link
 * "secondary" (→ TextLink) are deliberately out of scope.
 */
type ButtonProps = ButtonVariantProps & ButtonHTMLAttributes<HTMLButtonElement>

export function Button({ variant, size, className, type = 'button', ...rest }: ButtonProps) {
  return <button type={type} className={cx(button({ variant, size }), className)} {...rest} />
}
