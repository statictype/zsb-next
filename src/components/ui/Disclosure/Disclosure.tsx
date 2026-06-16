import { RiArrowDownSLine } from '@remixicon/react'
import type { ReactNode } from 'react'
import { cx } from 'styled-system/css'
import { disclosure } from './Disclosure.recipe'

interface DisclosureProps {
  /** The always-visible summary label (the clickable row). Style is the caller's
   *  — pass a styled `<span>`, a heading, etc. */
  summary: ReactNode
  /** Optional trailing meta shown before the chevron (e.g. an event count). */
  meta?: ReactNode
  /** Initial open state → the native `open` attribute. Uncontrolled thereafter
   *  (native toggle owns it; no JS list state). */
  defaultOpen?: boolean | undefined
  /** Native single-open group: disclosures sharing a `name` auto-close each
   *  other. Omit for the multi-open default — each one is independent. */
  name?: string | undefined
  /** cx escape on the `<details>` root — typically the caller's border treatment. */
  className?: string | undefined
  /** The panel content, revealed on open. */
  children: ReactNode
}

/**
 * Shared presentational disclosure — native `<details>/<summary>`, zero JS, the
 * house style across VenuesView / VisitFaq / (later) the Calendar archive. Open
 * state is the native attribute; the caller owns whether to render a disclosure
 * at all and its initial open state. See `Disclosure.recipe.ts` for the chrome.
 */
export function Disclosure({
  summary,
  meta,
  defaultOpen,
  name,
  className,
  children,
}: DisclosureProps) {
  const styles = disclosure()
  return (
    <details className={cx(styles.root, className)} open={defaultOpen} name={name}>
      <summary className={styles.summary}>
        {summary}
        <span className={styles.trailing}>
          {meta}
          <RiArrowDownSLine className={styles.chevron} size={20} aria-hidden />
        </span>
      </summary>
      <div className={styles.panel}>{children}</div>
    </details>
  )
}
