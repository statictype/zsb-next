'use client'

import { Accordion as ArkAccordion } from '@ark-ui/react/accordion'
import { RiArrowDownSLine } from '@remixicon/react'
import type { ReactNode } from 'react'
import { cx } from 'styled-system/css'
import { accordion } from 'styled-system/recipes'

export interface AccordionItem {
  id: string
  trigger: ReactNode
  content: ReactNode
  meta?: ReactNode
}

interface AccordionProps {
  id?: string | undefined
  items: AccordionItem[]
  multiple?: boolean
  triggerTypography?: 'standard' | 'display'
  className?: string | undefined
}

/**
 * The site's one-piece disclosure list. Ark owns state, IDs, keyboard behavior,
 * and ARIA; Panda owns the anatomy-aligned visual contract.
 */
export function Accordion({
  id,
  items,
  multiple = false,
  triggerTypography = 'standard',
  className,
}: AccordionProps) {
  const styles = accordion({ triggerTypography })

  return (
    <ArkAccordion.Root
      {...(id ? { id } : {})}
      className={cx(styles.root, className)}
      defaultValue={[]}
      multiple={multiple}
      collapsible
      lazyMount={false}
      unmountOnExit={false}
    >
      {items.map((item) => (
        <ArkAccordion.Item key={item.id} value={item.id} className={styles.item}>
          <ArkAccordion.ItemTrigger className={styles.itemTrigger}>
            {item.trigger}
            {item.meta !== undefined && <span data-accordion-meta>{item.meta}</span>}
            <ArkAccordion.ItemIndicator className={styles.itemIndicator}>
              <RiArrowDownSLine size={20} aria-hidden />
            </ArkAccordion.ItemIndicator>
          </ArkAccordion.ItemTrigger>
          <ArkAccordion.ItemContent className={styles.itemContent}>
            {item.content}
          </ArkAccordion.ItemContent>
        </ArkAccordion.Item>
      ))}
    </ArkAccordion.Root>
  )
}
