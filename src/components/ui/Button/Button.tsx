import type { ButtonHTMLAttributes } from 'react'
import { cx } from 'styled-system/css'
import { type ButtonVariantProps, button } from 'styled-system/recipes'

/**
 * Button — the one action primitive (ADR 0019): primary | secondary | ghost |
 * text × size. The `text` variant absorbs the retired `textLink`. Renders a
 * `<button>`; link-shaped buttons apply `button({...})` to an `<a>`/`<Link>`
 * directly.
 */
type ButtonProps = ButtonVariantProps & ButtonHTMLAttributes<HTMLButtonElement>

export function Button({ variant, size, className, type = 'button', ...rest }: ButtonProps) {
  return <button type={type} className={cx(button({ variant, size }), className)} {...rest} />
}
