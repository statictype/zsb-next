import {
  type ButtonHTMLAttributes,
  cloneElement,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from 'react'
import { cx } from 'styled-system/css'
import { Text } from 'styled-system/jsx'
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
  children: ReactElement<{ children?: ReactNode; className?: string | undefined }>
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
    const child = rest.children as ReactElement<{ children?: ReactNode; className?: string }>
    return cloneElement(child, {
      className: cx(cls, child.props.className),
      children:
        variant === 'link' ? (
          child.props.children
        ) : (
          <Text variant="label" display="contents">
            {child.props.children}
          </Text>
        ),
    })
  }
  const children =
    variant === 'link' ? (
      rest.children
    ) : (
      <Text variant="label" display="contents">
        {rest.children}
      </Text>
    )
  return (
    <button type={type} className={cls} {...rest}>
      {children}
    </button>
  )
}
