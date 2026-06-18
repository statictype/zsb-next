import { type ButtonHTMLAttributes, cloneElement, isValidElement, type ReactElement } from 'react'
import { cx } from 'styled-system/css'
import { type ButtonVariantProps, button } from 'styled-system/recipes'

/**
 * Button — the one action primitive (ADR 0019): primary | secondary | ghost |
 * text | icon × size. The `text` variant absorbs the retired `textLink`; `icon`
 * absorbs the retired `IconButton`.
 *
 * Renders a `<button>` by default. With **`asChild`** it renders *as* its single
 * child instead — merging the button className onto the call site's own
 * `<a>`/`<Link>`/`<span>` (no wrapper, no nested-interactive). Use it for
 * link/span CTAs so they carry the real element's native props + types.
 */
type ButtonProps = ButtonVariantProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean | undefined }

export function Button({
  variant,
  size,
  className,
  asChild,
  type = 'button',
  ...rest
}: ButtonProps) {
  const cls = cx(button({ variant, size }), className)
  if (asChild && isValidElement(rest.children)) {
    const child = rest.children as ReactElement<{ className?: string }>
    return cloneElement(child, { className: cx(cls, child.props.className) })
  }
  return <button type={type} className={cls} {...rest} />
}
