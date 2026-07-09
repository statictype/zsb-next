import { type ButtonHTMLAttributes, cloneElement, isValidElement, type ReactElement } from 'react'
import { cx } from 'styled-system/css'
import { type ButtonVariantProps, button } from 'styled-system/recipes'

/**
 * Button — the one action primitive (ADR 0019): primary | secondary | link |
 * icon × size. The `link` variant absorbs the retired `textLink`; `icon`
 * absorbs the retired `IconButton`.
 *
 * Renders a `<button>` by default. With **`asChild`** it renders *as* its single
 * child instead — merging the button className onto the call site's own
 * `<a>`/`<Link>` (no wrapper, no nested-interactive). Element-specific props
 * belong on that child so its own native types remain authoritative.
 */
type ButtonOwnProps = ButtonVariantProps & { className?: string | undefined }

type NativeButtonProps = ButtonOwnProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className'> & {
    asChild?: false | undefined
  }

type ButtonAsChildProps = ButtonOwnProps & {
  asChild: true
  children: ReactElement<{ className?: string | undefined }>
  type?: never
}

type ButtonProps = NativeButtonProps | ButtonAsChildProps

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
