import type { OnlineEdition } from '@/types/edition'
import styles from './OnlineHero.module.css'

interface OnlineHeroProps {
  edition: Pick<OnlineEdition, 'year' | 'theme' | 'themeHighlight' | 'dateTape'>
}

function splitOnFirst(a: string, b: string) {
  const [before, ...rest] = a.split(b)
  if (!rest.length || !before) return null
  return [before, rest.join(b)] as [string, string]
}

function HeroThemeDisplay({ theme, themeHighlight }: { theme: string; themeHighlight: string }) {
  const [firstPart, secondPart] = splitOnFirst(theme, themeHighlight) ?? [theme, '']
  return (
    <h1 className={styles.theme}>
      {themeHighlight ? (
        <>
          <span>{firstPart}</span>
          <span className={styles.themeHighlight}>{themeHighlight}</span>
          <span>{secondPart}</span>
        </>
      ) : (
        theme
      )}
    </h1>
  )
}

export function OnlineHero({ edition }: OnlineHeroProps) {
  const { year, theme, themeHighlight, dateTape } = edition

  return (
    <header className={styles.hero}>
      <div className={styles.field} aria-hidden>
        <div className={styles.grid} />
        <div className={styles.dots} />
        <div className={styles.scan} />
      </div>

      <div className={styles.content}>
        <div className={styles.eyebrow}>Bucharest Sculpture Days</div>
        <div className={styles.year} data-year={year}>
          ZSB{year}
        </div>
        <HeroThemeDisplay theme={theme} themeHighlight={themeHighlight} />
        <div className={styles.dateTape}>{dateTape}</div>
      </div>

      <div className={styles.scroll}>
        <span className={styles.scrollText}>Scroll</span>
        <div className={styles.scrollLine} />
      </div>
    </header>
  )
}
