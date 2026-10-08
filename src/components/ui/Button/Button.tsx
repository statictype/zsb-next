import { RiArrowLeftLine, RiArrowRightLine, RiArrowRightUpLine } from '@remixicon/react'
import {
  type ButtonHTMLAttributes,
  Children,
  cloneElement,
  isValidElement,
  type ReactElement,
  type ReactNode,
  type Ref,
} from 'react'
import { cx } from 'styled-system/css'
import { type ButtonVariantProps, button } from 'styled-system/recipes'

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

const ARROWS = new Map<unknown, string>([
  [RiArrowRightLine, 'right'],
  [RiArrowRightUpLine, 'up-right'],
  [RiArrowLeftLine, 'left'],
])

function isArrow(node: unknown): node is ReactElement {
  return isValidElement(node) && ARROWS.has(node.type)
}

function arrow(node: ReactElement) {
  return (
    <span key={node.key} data-btn-arrow={ARROWS.get(node.type)}>
      {node}
    </span>
  )
}

function rollingLabel(children: ReactNode) {
  const nodes = Children.toArray(children)
  let start = 0
  while (isArrow(nodes[start])) start++
  let end = nodes.length
  while (end > start && isArrow(nodes[end - 1])) end--
  const label = nodes.slice(start, end)

  return (
    <>
      {nodes.slice(0, start).filter(isArrow).map(arrow)}
      <span data-btn-mask>
        <span data-btn-label>
          {label}
          <span data-btn-copy aria-hidden>
            {label}
          </span>
        </span>
      </span>
      {nodes.slice(end).filter(isArrow).map(arrow)}
    </>
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
