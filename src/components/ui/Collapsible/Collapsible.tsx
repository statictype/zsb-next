'use client'

import { Collapsible as ArkCollapsible } from '@ark-ui/react/collapsible'
import { RiArrowDownSLine } from '@remixicon/react'
import type { ReactNode } from 'react'
import { cx } from 'styled-system/css'
import { collapsible } from 'styled-system/recipes'

interface CollapsibleProps {
  id?: string | undefined
  closedLabel: ReactNode
  openLabel: ReactNode
  meta?: ReactNode
  children: ReactNode
  className?: string | undefined
}

/** One independent disclosure. Ark owns state and accessibility; callers only supply content labels. */
export function Collapsible({
  id,
  closedLabel,
  openLabel,
  meta,
  children,
  className,
}: CollapsibleProps) {
  const styles = collapsible()

  return (
    <ArkCollapsible.Root
      {...(id ? { id } : {})}
      className={cx(styles.root, className)}
      defaultOpen={false}
      lazyMount={false}
      unmountOnExit={false}
    >
      <ArkCollapsible.Trigger className={styles.trigger}>
        <span data-collapsible-label="closed">{closedLabel}</span>
        <span data-collapsible-label="open">{openLabel}</span>
        {meta !== undefined && <span data-collapsible-meta>{meta}</span>}
        <ArkCollapsible.Indicator className={styles.indicator}>
          <RiArrowDownSLine size={20} aria-hidden />
        </ArkCollapsible.Indicator>
      </ArkCollapsible.Trigger>
      <ArkCollapsible.Content className={styles.content}>{children}</ArkCollapsible.Content>
    </ArkCollapsible.Root>
  )
}
