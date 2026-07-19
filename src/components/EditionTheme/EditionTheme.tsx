import type { CSSProperties, ReactNode } from 'react'
import { cx } from 'styled-system/css'
import { Text } from 'styled-system/jsx'
import { AccentSplit } from '@/components/AccentSplit/AccentSplit'
import { editionTheme } from '@/components/EditionTheme/EditionTheme.recipe'

interface EditionThemeProps {
  theme: string

  lead?: ReactNode | undefined

  themeHighlight?: string | undefined

  meta?: ReactNode | undefined
  as?: 'h1' | 'h2' | undefined

  size?: 'huge' | 'large' | 'normal' | 'rail' | undefined

  interactive?: boolean | undefined

  accent?: 'highlight' | 'action' | undefined

  muted?: boolean | undefined

  delay?: string | undefined

  className?: string | undefined
}

export function EditionTheme({
  theme,
  lead,
  themeHighlight,
  meta,
  as: Tag = 'h2',
  size = 'normal',
  interactive = false,
  accent = 'highlight',
  muted = false,
  delay,
  className,
}: EditionThemeProps) {
  const styles = editionTheme({ size, interactive, accent, muted })
  return (
    <div
      className={cx(styles.root, className)}
      style={delay ? ({ '--tape-delay': delay } as CSSProperties) : undefined}
    >
      <Tag className={styles.heading}>
        {/* The trailing space is invisible to flex layout but keeps the
            heading's accessible name from fusing lead and theme ("2026 the…"
            instead of "2026the…"). */}
        {lead ? <span className={styles.lead}>{lead}</span> : null}
        {lead ? ' ' : null}
        <AccentSplit text={theme} accent={themeHighlight} className={styles.highlight} />
      </Tag>
      {meta ? (
        <Text as="p" variant="caption" className={styles.meta}>
          {meta}
        </Text>
      ) : null}
    </div>
  )
}
