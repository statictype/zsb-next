'use client'

import { Accordion as ArkAccordion } from '@ark-ui/react/accordion'
import { RiArrowDownSLine } from '@remixicon/react'
import type { ReactNode } from 'react'
import { css, cx } from 'styled-system/css'
import { Text } from 'styled-system/jsx'
import { accordion } from 'styled-system/recipes'

export interface AccordionItem {
  id: string
  /** Phrasing content for the button. Use `triggerHeading` for heading semantics. */
  trigger: ReactNode
  content: ReactNode
  meta?: ReactNode
  triggerHeading?: 'h3' | 'h4' | undefined
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
      {items.map((item) => {
        const trigger = (
          <ArkAccordion.ItemTrigger className={styles.itemTrigger}>
            {triggerTypography === 'display' ? (
              <Text variant="heading">{item.trigger}</Text>
            ) : (
              item.trigger
            )}
            {item.meta !== undefined && (
              <Text variant="label" data-accordion-meta>
                {item.meta}
              </Text>
            )}
            <ArkAccordion.ItemIndicator className={styles.itemIndicator}>
              <RiArrowDownSLine size={20} aria-hidden />
            </ArkAccordion.ItemIndicator>
          </ArkAccordion.ItemTrigger>
        )
        const TriggerHeading = item.triggerHeading

        return (
          <ArkAccordion.Item key={item.id} value={item.id} className={styles.item}>
            {TriggerHeading ? (
              <TriggerHeading className={css({ margin: '0' })}>{trigger}</TriggerHeading>
            ) : (
              trigger
            )}
            <ArkAccordion.ItemContent className={styles.itemContent}>
              {item.content}
            </ArkAccordion.ItemContent>
          </ArkAccordion.Item>
        )
      })}
    </ArkAccordion.Root>
  )
}
