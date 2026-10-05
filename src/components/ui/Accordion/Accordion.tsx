'use client'

import { RiArrowDownSLine } from '@remixicon/react'
import { type ReactNode, useId, useState } from 'react'
import { css, cx } from 'styled-system/css'
import { Text } from 'styled-system/jsx'
import { accordion } from 'styled-system/recipes'

export interface AccordionItem {
  id: string
  /** Phrasing content for the button. Use `triggerHeading` for heading semantics. */
  trigger: ReactNode
  content: ReactNode
  meta?: ReactNode
  triggerHeading?: 'h3' | 'h4'
}

interface AccordionProps {
  id?: string
  items: AccordionItem[]
  multiple?: boolean
  className?: string | undefined
}

export function Accordion({ id, items, multiple = false, className }: AccordionProps) {
  const styles = accordion()
  const baseId = useId()
  const [openIds, setOpenIds] = useState<string[]>([])

  const toggle = (itemId: string) =>
    setOpenIds((current) => {
      if (current.includes(itemId)) return current.filter((openId) => openId !== itemId)
      return multiple ? [...current, itemId] : [itemId]
    })

  return (
    <div id={id} className={cx(styles.root, className)}>
      {items.map((item, index) => {
        const open = openIds.includes(item.id)
        const state = open ? 'open' : 'closed'
        const triggerId = `${baseId}-trigger-${index}`
        const contentId = `${baseId}-content-${index}`
        const trigger = (
          <button
            type="button"
            id={triggerId}
            className={styles.itemTrigger}
            aria-expanded={open}
            aria-controls={contentId}
            data-state={state}
            onClick={() => toggle(item.id)}
          >
            <Text variant="rowTitle">{item.trigger}</Text>
            {item.meta !== undefined && (
              <Text variant="label" data-accordion-meta>
                {item.meta}
              </Text>
            )}
            <span className={styles.itemIndicator} data-state={state} aria-hidden>
              <RiArrowDownSLine size={20} aria-hidden />
            </span>
          </button>
        )
        const TriggerHeading = item.triggerHeading

        return (
          <div key={item.id} className={styles.item} data-state={state}>
            {TriggerHeading ? (
              <TriggerHeading className={css({ margin: '0' })}>{trigger}</TriggerHeading>
            ) : (
              trigger
            )}
            <div
              id={contentId}
              role="region"
              aria-labelledby={triggerId}
              className={styles.itemContent}
              hidden={!open}
            >
              {item.content}
            </div>
          </div>
        )
      })}
    </div>
  )
}
