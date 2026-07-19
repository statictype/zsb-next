import { RiArrowRightUpLine } from '@remixicon/react'
import Link from 'next/link'
import type { ReactNode } from 'react'
import { cx } from 'styled-system/css'
import { Text } from 'styled-system/jsx'
import { linkList } from '@/components/ui/LinkList/LinkList.recipe'

export function LinkList({
  children,
  className,
}: {
  children: ReactNode
  className?: string | undefined
}) {
  const styles = linkList()
  return <ul className={cx(styles.list, className)}>{children}</ul>
}

interface LinkListItemProps {
  year: number | string
  title: ReactNode
  href?: string | undefined
  excerpt?: ReactNode | undefined
  tags?: ReactNode[] | undefined
  external?: boolean | undefined
  disabled?: boolean | undefined
}

export function LinkListItem({
  year,
  title,
  href,
  excerpt,
  tags = [],
  external = false,
  disabled = false,
}: LinkListItemProps) {
  const styles = linkList()
  const content = (
    <>
      <Text variant="label" className={styles.year}>
        {year}
      </Text>
      <span className={styles.body}>
        <Text variant="heading" className={styles.title}>
          {title}
        </Text>
        {excerpt ? (
          <Text variant="caption" className={styles.excerpt}>
            {excerpt}
          </Text>
        ) : null}
      </span>
      {tags.length > 0 ? <span className={styles.tags}>{tags}</span> : null}
      {!disabled ? (
        <span className={styles.arrow} aria-hidden>
          <RiArrowRightUpLine size={24} />
        </span>
      ) : null}
    </>
  )

  return (
    <li className={styles.item}>
      {disabled || !href ? (
        <div className={styles.link} aria-disabled="true">
          {content}
        </div>
      ) : external ? (
        <a href={href} className={styles.link} target="_blank" rel="noreferrer noopener">
          {content}
        </a>
      ) : (
        <Link href={href} className={styles.link}>
          {content}
        </Link>
      )}
    </li>
  )
}
