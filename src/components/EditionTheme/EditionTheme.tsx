import { cx } from 'styled-system/css'
import { editionTheme } from './EditionTheme.recipe'

interface EditionThemeProps {
  /** The edition theme line (e.g. "the weight of light"). */
  theme: string
  /** A substring of `theme` to accent. When set, the tape splits on its first
   *  occurrence and wraps it in the highlight span. */
  themeHighlight?: string | undefined
  /** Heading level — `h1` for the edition hero, `h2` elsewhere. */
  as?: 'h1' | 'h2' | undefined
  /** Font-size ladder: `huge` (edition hero), `large` (featured card), `normal`. */
  size?: 'huge' | 'large' | 'normal' | undefined
  /** `true` (cards / nav): highlight is white at rest, accent on `a:hover`.
   *  `false` (edition hero): highlight is the accent at rest, static. */
  interactive?: boolean | undefined
  /** Entrance delay for the `tapeIn` reveal — a fixed value (the hero) or a
   *  stagger expression (`calc(var(--card-index)…)` on the editions cards). */
  delay?: string | undefined
  /** cx escape for container positioning only (e.g. the hero's tuck under the
   *  nav). Not for tape identity — that's all baked in. */
  className?: string | undefined
}

/** Split `a` on the first occurrence of `b` → `[before, after]`, or null. */
function splitOnFirst(a: string, b: string): [string, string] | null {
  const [before, ...rest] = a.split(b)
  if (!rest.length || !before) return null
  return [before, rest.join(b)]
}

/**
 * The shared edition "theme tape" — owns the split-on-highlight markup and the
 * canonical tape style. See `EditionTheme.recipe.ts` for the chrome.
 */
export function EditionTheme({
  theme,
  themeHighlight,
  as: Tag = 'h2',
  size = 'normal',
  interactive = false,
  delay,
  className,
}: EditionThemeProps) {
  const styles = editionTheme({ size, interactive })
  const parts = themeHighlight ? splitOnFirst(theme, themeHighlight) : null
  return (
    <Tag
      className={cx(styles.root, className)}
      style={delay ? { animationDelay: delay } : undefined}
    >
      {parts ? (
        <>
          {parts[0]}
          <span className={styles.highlight}>{themeHighlight}</span>
          {parts[1]}
        </>
      ) : (
        theme
      )}
    </Tag>
  )
}
