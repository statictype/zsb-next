import type { CSSProperties } from 'react'
import type { Edition } from '@/types/edition'
import styles from './Hero.module.css'

type CSSWithVars = CSSProperties & Record<`--${string}`, string>

interface HeroProps {
  edition: Pick<Edition, 'year' | 'theme' | 'themeHighlight' | 'heroImage' | 'dateTape'>
}

function splitOnFirst(a: string, b: string) {
  const [before, ...rest] = a.split(b)
  if (!rest.length || !before) return null
  return [before, rest.join(b)] as [string, string]
}

function HeroThemeDisplay({
  theme,
  themeHighlight = '',
}: {
  theme: string
  themeHighlight: string
}) {
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

export function Hero({ edition }: HeroProps) {
  const { year, theme, themeHighlight, heroImage, dateTape } = edition
  const ext = heroImage.ext ?? 'webp'
  const bgStyle: CSSWithVars = {
    '--bg-url-sm': `url(${heroImage.basePath}-1200.${ext})`,
    '--bg-url-lg': `url(${heroImage.basePath}-1920.${ext})`,
  }

  return (
    <header className={styles.hero}>
      {/* Background layers */}
      <div className={styles.bgImage} style={bgStyle} />
      <div className={styles.colorLayer} />
      <div className={styles.vignette} />

      {/* Content */}
      <div className={styles.content}>
        <div className={styles.eyebrow}>Bucharest Sculpture Days</div>
        <div className={styles.year} data-year={year}>
          ZSB{year}
        </div>
        <HeroThemeDisplay theme={theme} themeHighlight={themeHighlight} />

        <div className={styles.dateTape}>{dateTape}</div>
      </div>

      {/* Scroll indicator — hidden mobile, visible desktop */}
      <div className={styles.scroll}>
        <span className={styles.scrollText}>Scroll</span>
        <div className={styles.scrollLine} />
      </div>
    </header>
  )
}
