import type { ButtonHTMLAttributes } from 'react'
import { cx } from 'styled-system/css'
import { type ButtonVariantProps, button } from 'styled-system/recipes'

/**
 * Button — the one action primitive (ADR 0019): primary | secondary | ghost |
 * text × size. The `text` variant absorbs the retired `textLink`; the
 * `magnetic` modifier (retired MagneticButton) is wired in B4.
 */
type ButtonProps = ButtonVariantProps & ButtonHTMLAttributes<HTMLButtonElement>

export function Button({ variant, size, className, type = 'button', ...rest }: ButtonProps) {
  return <button type={type} className={cx(button({ variant, size }), className)} {...rest} />
}
