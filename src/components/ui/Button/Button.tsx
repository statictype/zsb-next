import {
  type ButtonHTMLAttributes,
  cloneElement,
  isValidElement,
  type ReactElement,
  type ReactNode,
  type Ref,
} from 'react'
import { cx } from 'styled-system/css'
import { type ButtonVariantProps, button } from 'styled-system/recipes'

/**
 * Button — the one action primitive (ADR 0019): primary | secondary | quiet |
 * icon | link | plain × size. The `link` variant absorbs the retired
 * `textLink`; `icon` absorbs the retired `IconButton`; `plain` is a pressable
 * surface that carries its own look (a media plate, an image card).
 *
 * Renders a `<button>` by default. With **`asChild`** it renders *as* its single
 * child instead — merging the button className onto the call site's own
 * `<a>`/`<Link>` (no wrapper, no nested-interactive). Element-specific props
 * belong on that child so its own native types remain authoritative.
 */
type ButtonOwnProps = ButtonVariantProps & { className?: string | undefined }

type NativeButtonProps = ButtonOwnProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className'> & {
    asChild?: false
    ref?: Ref<HTMLButtonElement>
  }

type ButtonAsChildProps = ButtonOwnProps & {
  asChild: true
  children: ReactElement<{ children?: ReactNode; className?: string | undefined }>
  type?: never
}

type ButtonProps = NativeButtonProps | ButtonAsChildProps

type Variant = NonNullable<ButtonVariantProps['variant']>

const ROLLING: readonly Variant[] = ['primary', 'secondary', 'quiet']

function rollingLabel(children: ReactNode) {
  return (
    <span data-btn-mask>
      <span data-btn-label>
        {children}
        <span data-btn-copy aria-hidden>
          {children}
        </span>
      </span>
    </span>
  )
}

export function Button({
  variant,
  size,
  className,
  asChild,
  type = 'button',
  ...rest
}: ButtonProps) {
  const cls = cx(button({ variant, size }), className)
  const rolls = ROLLING.includes(variant ?? 'primary')

  if (asChild && isValidElement(rest.children)) {
    const child = rest.children as ReactElement<{
      children?: ReactNode
      className?: string | undefined
    }>
    return cloneElement(child, {
      className: cx(cls, child.props.className),
      children: rolls ? rollingLabel(child.props.children) : child.props.children,
    })
  }

  const { children, ...buttonProps } = rest
  return (
    <button type={type} className={cls} {...buttonProps}>
      {rolls ? rollingLabel(children) : children}
    </button>
  )
}
