import { RiCheckLine } from '@remixicon/react'
import type { ReactNode } from 'react'
import { cx } from 'styled-system/css'
import { checkbox } from './Checkbox.recipe'

interface CheckboxProps {
  /** The chip label. */
  label: ReactNode
  checked: boolean
  /** Called with the next checked state on toggle (click / Space / label). */
  onChange: (checked: boolean) => void
  /** Optional trailing count. */
  count?: number | undefined
  className?: string | undefined
}

/**
 * Selectable facet chip — a real checkbox with the chip styling baked in. The
 * caller passes only `label` / `count` / `checked` / `onChange`; see
 * `Checkbox.recipe.ts` for the chrome and selected/hover/focus states.
 */
export function Checkbox({ label, checked, onChange, count, className }: CheckboxProps) {
  const styles = checkbox()
  return (
    <label className={cx(styles.root, className)}>
      <input
        type="checkbox"
        className={styles.input}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className={styles.box} aria-hidden>
        {checked && <RiCheckLine size={12} />}
      </span>
      {label}
      {count != null && <span className={styles.count}>{count}</span>}
    </label>
  )
}
