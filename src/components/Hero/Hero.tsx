import Image from 'next/image'
import type { Edition } from '@/types/edition'
import styles from './Hero.module.css'

interface HeroProps {
  edition: Pick<Edition, 'year' | 'theme' | 'themeHighlight' | 'heroImage' | 'dateTape'>
}

function splitOnFirst(a: string, b: string) {
  const [before, ...rest] = a.split(b)
  if (!rest.length || !before) return null
  return [before, rest.join(b)] as [string, string]
}

function ThemeTape({
  theme,
  themeHighlight = '',
}: {
  theme: string
  themeHighlight: string
}) {
  const [firstPart, secondPart] = splitOnFirst(theme, themeHighlight) ?? [theme, '']
  return (
    <h1 className={styles.tapeTheme}>
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

  return (
    <header className={styles.hero}>
      <div className={styles.stage}>
        <div className={styles.frame}>
          <div className={styles.background} aria-hidden="true" />
          <Image
            src={heroImage.src}
            alt={heroImage.alt}
            fill
            sizes="(min-width: 1280px) 1200px, (min-width: 768px) 92vw, 100vw"
            priority
            className={styles.image}
          />
          <div className={styles.vignette} aria-hidden="true" />
        </div>

        <div className={styles.tapes}>
          <span className={styles.tapeDate}>{dateTape}</span>
          <ThemeTape theme={theme} themeHighlight={themeHighlight} />
          <span className={styles.tapeEdition}>
            Bucharest Sculpture Days <span className={styles.editionSep}>/</span> ZSB {year}
          </span>
        </div>
      </div>
    </header>
  )
}
