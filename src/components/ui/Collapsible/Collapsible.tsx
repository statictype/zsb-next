'use client'

import { Collapsible as ArkCollapsible } from '@ark-ui/react/collapsible'
import { RiArrowDownSLine } from '@remixicon/react'
import type { ReactNode } from 'react'
import { cx } from 'styled-system/css'
import { Text } from 'styled-system/jsx'
import { collapsible } from 'styled-system/recipes'

interface CollapsibleProps {
  closedLabel: ReactNode
  openLabel: ReactNode
  children: ReactNode
  className?: string | undefined
}

/** One independent disclosure. Ark owns state and accessibility; callers only supply content labels. */
export function Collapsible({ closedLabel, openLabel, children, className }: CollapsibleProps) {
  const styles = collapsible()

  return (
    <ArkCollapsible.Root
      className={cx(styles.root, className)}
      defaultOpen={false}
      lazyMount={false}
      unmountOnExit={false}
    >
      <ArkCollapsible.Trigger className={styles.trigger}>
        <Text variant="label" data-collapsible-label="closed">
          {closedLabel}
        </Text>
        <Text variant="label" data-collapsible-label="open">
          {openLabel}
        </Text>
        <ArkCollapsible.Indicator className={styles.indicator}>
          <RiArrowDownSLine size={20} aria-hidden />
        </ArkCollapsible.Indicator>
      </ArkCollapsible.Trigger>
      <ArkCollapsible.Content className={styles.content}>{children}</ArkCollapsible.Content>
    </ArkCollapsible.Root>
  )
}
