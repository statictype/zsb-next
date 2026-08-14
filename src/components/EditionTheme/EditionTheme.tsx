import type { ReactNode } from 'react'
import { cx } from 'styled-system/css'
import { AccentSplit } from '@/components/AccentSplit/AccentSplit'
import { editionTheme } from '@/components/EditionTheme/EditionTheme.recipe'

interface EditionThemeProps {
  theme: string

  lead?: ReactNode

  themeHighlight?: string | undefined

  as?: 'h1' | 'h2' | 'p'

  size?: 'large' | 'normal' | 'rail' | 'sub' | 'cell'

  interactive?: boolean

  accent?: 'highlight' | 'action' | 'none'

  muted?: boolean

  className?: string | undefined
}

export function EditionTheme({
  theme,
  lead,
  themeHighlight,
  as: Tag = 'h2',
  size = 'normal',
  interactive = false,
  accent = 'highlight',
  muted = false,
  className,
}: EditionThemeProps) {
  const styles = editionTheme({ size, interactive, accent, muted })
  return (
    <Tag className={cx(styles.heading, className)}>
      {/* The trailing space is invisible to flex layout but keeps the
          heading's accessible name from fusing lead and theme ("2026 the…"
          instead of "2026the…"). */}
      {lead ? <span className={styles.lead}>{lead}</span> : null}
      {lead ? ' ' : null}
      <AccentSplit text={theme} accent={themeHighlight} className={styles.highlight} />
    </Tag>
  )
}
