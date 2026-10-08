import {
  cloneElement,
  type ElementType,
  type HTMLAttributes,
  isValidElement,
  type ReactElement,
} from 'react'
import { cx } from 'styled-system/css'
import { type CardVariantProps, card } from 'styled-system/recipes'

type CardOwnProps = CardVariantProps & { className?: string | undefined }

type CardAsProps = CardOwnProps &
  HTMLAttributes<HTMLElement> & {
    asChild?: false
    as?: ElementType
    href?: string
  }

type CardAsChildProps = CardOwnProps & {
  asChild: true
  children: ReactElement<{ className?: string | undefined }>
}

type CardProps = CardAsProps | CardAsChildProps

export function Card({ interactive, className, asChild, ...rest }: CardProps) {
  const cls = cx(card({ interactive }), className)
  if (asChild && isValidElement(rest.children)) {
    const child = rest.children as ReactElement<{ className?: string | undefined }>
    return cloneElement(child, { className: cx(cls, child.props.className) })
  }
  const { as: Tag = 'div', ...domProps } = rest as CardAsProps
  return <Tag className={cls} {...domProps} />
}
