import type { ReactNode } from 'react'
import { css } from 'styled-system/css'

const accentClass = css({ color: 'action' })

interface AccentSplitProps {
  /** The full string, e.g. "Bucharest Sculpture Days". */
  text: string
  /** A substring of `text` to emphasize, e.g. "Sculpture Days". */
  accent: string
  /** Class for the accent span. Defaults to the shared accent token. */
  className?: string | undefined
  /**
   * Drop the accent onto its own line (trims the preceding text and inserts a
   * `<br />`). Used by the hero titles and the partners CTA heading; the other
   * call-sites render the accent inline.
   */
  lineBreak?: boolean
}

/**
 * Splits `text` on the first occurrence of `accent` and wraps the accent in a
 * styled span. If `accent` isn't found, renders `text` unchanged. Replaces the
 * per-page HeroTitle / CtaHeading helpers that all implemented this by hand.
 */
export function AccentSplit({
  text,
  accent,
  className = accentClass,
  lineBreak = false,
}: AccentSplitProps): ReactNode {
  const idx = text.indexOf(accent)
  if (idx === -1) return <>{text}</>

  if (lineBreak) {
    const before = text.slice(0, idx).trimEnd()
    return (
      <>
        {before}
        {before && <br />}
        <span className={className}>{accent}</span>
      </>
    )
  }

  return (
    <>
      {text.slice(0, idx)}
      <span className={className}>{accent}</span>
    </>
  )
}
