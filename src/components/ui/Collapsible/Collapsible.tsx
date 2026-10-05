'use client'

import { RiArrowDownSLine } from '@remixicon/react'
import { type ReactNode, useId, useState } from 'react'
import { cx } from 'styled-system/css'
import { Text } from 'styled-system/jsx'
import { collapsible } from 'styled-system/recipes'

interface CollapsibleProps {
  id?: string
  closedLabel: ReactNode
  openLabel: ReactNode
  meta?: ReactNode
  children: ReactNode
  className?: string | undefined
}

export function Collapsible({
  id,
  closedLabel,
  openLabel,
  meta,
  children,
  className,
}: CollapsibleProps) {
  const styles = collapsible()
  const contentId = useId()
  const [open, setOpen] = useState(false)
  const state = open ? 'open' : 'closed'

  return (
    <div id={id} className={cx(styles.root, className)} data-state={state}>
      <button
        type="button"
        className={styles.trigger}
        aria-expanded={open}
        aria-controls={contentId}
        data-part="trigger"
        data-state={state}
        onClick={() => setOpen((current) => !current)}
      >
        <Text variant="label" data-collapsible-label="closed">
          {closedLabel}
        </Text>
        <Text variant="label" data-collapsible-label="open">
          {openLabel}
        </Text>
        {meta !== undefined && (
          <Text variant="label" data-collapsible-meta>
            {meta}
          </Text>
        )}
        <span className={styles.indicator} data-part="indicator" data-state={state} aria-hidden>
          <RiArrowDownSLine size={20} aria-hidden />
        </span>
      </button>
      <div id={contentId} className={styles.content} data-part="content" hidden={!open}>
        {children}
      </div>
    </div>
  )
}
