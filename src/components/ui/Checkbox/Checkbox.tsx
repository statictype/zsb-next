'use client'

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
  count?: number
  className?: string | undefined
}

export function Checkbox({ id, label, checked, onCheckedChange, count, className }: CheckboxProps) {
  const styles = checkbox()
  const labelId = `${id}-label`
  return (
    <label className={cx(styles.root, className)}>
      <input
        id={id}
        type="checkbox"
        className={styles.input}
        checked={checked}
        aria-labelledby={labelId}
        onChange={(event) => onCheckedChange(event.target.checked)}
      />
      <span className={styles.control} aria-hidden>
        <span className={styles.indicator} hidden={!checked}>
          <RiCheckLine size={12} />
        </span>
      </span>
      <span id={labelId} className={styles.label}>
        <Text variant="label" color="current">
          {label}
        </Text>
      </span>
      {count != null && (
        <Text variant="label" color="current" data-checkbox-count>
          {count}
        </Text>
      )}
    </label>
  )
}
