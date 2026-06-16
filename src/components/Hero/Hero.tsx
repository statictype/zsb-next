import { cx } from 'styled-system/css'
import { enter } from '@/components/enter'
import { Figure } from '@/components/Figure/Figure'
import type { Edition } from '@/types/edition'
import { hero } from './Hero.recipe'

const styles = hero()

interface HeroProps {
  edition: Pick<Edition, 'year' | 'theme' | 'themeHighlight' | 'heroImage' | 'dateTape'>
}

function splitOnFirst(a: string, b: string) {
  const [before, ...rest] = a.split(b)
  if (!rest.length || !before) return null
  return [before, rest.join(b)] as [string, string]
}

function ThemeTape({ theme, themeHighlight = '' }: { theme: string; themeHighlight: string }) {
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
          <Figure
            image={heroImage}
            sizes="(min-width: 1024px) calc(100vw - 200px), 100vw"
            priority
            className={cx(styles.image, enter({ rise: 'none', zoom: true }))}
          />
          <div className={cx(styles.vignette, enter({ rise: 'none' }))} aria-hidden="true" />
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
