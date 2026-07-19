import type { CSSProperties, ReactNode } from 'react'
import { cx } from 'styled-system/css'
import { Text } from 'styled-system/jsx'
import { editionTheme } from '@/components/EditionTheme/EditionTheme.recipe'
import { splitFirstMatch } from '@/lib/split-first-match'

interface EditionThemeProps {
  /** The edition theme line (e.g. "the weight of light"). */
  theme: string
  /** Stamped inside the band, before the theme text (the editions rail's
   *  year/status badges). Part of the heading's accessible name — pass only
   *  content that reads sensibly there. */
  lead?: ReactNode | undefined
  /** A substring of `theme` to accent. When set, the tape splits on its first
   *  occurrence and wraps it in the highlight span. */
  themeHighlight?: string | undefined
  /** Small meta line rendered inside the band on its own row, under the theme
   *  text (the edition hero's date/venue). Lives outside the heading element,
   *  so it never pollutes the heading's accessible name. */
  meta?: ReactNode | undefined
  /** Heading level — `h1` for the edition hero, `h2` elsewhere. */
  as?: 'h1' | 'h2' | undefined
  /** Font-size ladder: `huge` (edition hero), `large` (featured card), `normal`, `rail` (editions rail plate). */
  size?: 'huge' | 'large' | 'normal' | 'rail' | undefined
  /** `true` (cards / nav): highlight is white at rest, pink on `a:hover`.
   *  `false` (edition hero/current nav): highlight is static, in `accent`. */
  interactive?: boolean | undefined
  /** Rest color of a static highlight — `highlight` (chartreuse) for
   *  active/current elements, `action` (pink) for decorative accent (the
   *  edition hero). No effect when `interactive`. */
  accent?: 'highlight' | 'action' | undefined
  /** De-emphasizes the whole heading (lead + theme text) — the rail's
   *  "announced" plate. */
  muted?: boolean | undefined
  /** Entrance delay for the `tapeIn` reveal — the edition hero's beat in its
   *  image → vignette → tape cascade. */
  delay?: string | undefined
  /** cx escape for container positioning only (e.g. the hero's tuck under the
   *  nav). Not for tape identity — that's all baked in. */
  className?: string | undefined
}

/**
 * The shared edition "theme tape" — owns the split-on-highlight markup and the
 * canonical tape style. See `EditionTheme.recipe.ts` for the chrome.
 */
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
  const parts = themeHighlight ? splitFirstMatch(theme, themeHighlight) : null
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
        {parts ? (
          <>
            {parts.before}
            <span className={styles.highlight}>{parts.match}</span>
            {parts.after}
          </>
        ) : (
          theme
        )}
      </Tag>
      {meta ? (
        <Text as="p" variant="caption" className={styles.meta}>
          {meta}
        </Text>
      ) : null}
    </div>
  )
}
