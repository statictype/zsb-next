'use client'

import { Checkbox as ArkCheckbox } from '@ark-ui/react/checkbox'
import { RiCheckLine } from '@remixicon/react'
import type { ReactNode } from 'react'
import { cx } from 'styled-system/css'
import { Text } from 'styled-system/jsx'
import { checkbox } from 'styled-system/recipes'

interface CheckboxProps {
  id: string
  label: ReactNode
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  count?: number | undefined
  className?: string | undefined
}

/**
 * Controlled site checkbox. Ark's value object and anatomy stay private; the
 * public callback receives only the next boolean state.
 */
export function Checkbox({ id, label, checked, onCheckedChange, count, className }: CheckboxProps) {
  const styles = checkbox()
  return (
    <ArkCheckbox.Root
      id={id}
      checked={checked}
      onCheckedChange={(details) => onCheckedChange(details.checked === true)}
      className={cx(styles.root, className)}
    >
      <ArkCheckbox.HiddenInput />
      <ArkCheckbox.Control className={styles.control}>
        <ArkCheckbox.Indicator className={styles.indicator}>
          <RiCheckLine size={12} />
        </ArkCheckbox.Indicator>
      </ArkCheckbox.Control>
      <ArkCheckbox.Label className={styles.label}>
        <Text variant="label">{label}</Text>
      </ArkCheckbox.Label>
      {count != null && (
        <Text variant="label" data-checkbox-count>
          {count}
        </Text>
      )}
    </ArkCheckbox.Root>
  )
}
