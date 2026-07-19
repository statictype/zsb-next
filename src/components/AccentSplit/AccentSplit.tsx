import type { ReactNode } from 'react'
import { css } from 'styled-system/css'
import { splitFirstMatch } from '@/lib/split-first-match'

const accentClass = css({ color: 'action' })

interface AccentSplitProps {
  text: string

  accent?: string | undefined
  className?: string | undefined

  lineBreak?: boolean
}

export function AccentSplit({
  text,
  accent,
  className = accentClass,
  lineBreak = false,
}: AccentSplitProps): ReactNode {
  const parts = accent ? splitFirstMatch(text, accent) : null
  if (!parts) return <>{text}</>

  if (lineBreak) {
    const before = parts.before.trimEnd()
    return (
      <>
        {before}
        {before && <br />}
        <span className={className}>{parts.match}</span>
        {parts.after}
      </>
    )
  }

  return (
    <>
      {parts.before}
      <span className={className}>{parts.match}</span>
      {parts.after}
    </>
  )
}
