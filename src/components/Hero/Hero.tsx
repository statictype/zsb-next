import { css, cx } from 'styled-system/css'
import { EditionTheme } from '@/components/EditionTheme/EditionTheme'
import { enter } from '@/components/enter'
import { Figure } from '@/components/Figure/Figure'
import type { Edition } from '@/types/edition'
import { hero } from './Hero.recipe'

const styles = hero()

// Container positioning only — tuck the theme tape under the nav, mirroring the
// per-tape left offsets of the date/edition tapes. (Entrance delay is a prop.)
const tapeTheme = css({
  marginLeft: { base: '10px', md: '18px', lg: '-36px', xl: '-40px' },
})

interface HeroProps {
  edition: Pick<Edition, 'year' | 'theme' | 'themeHighlight' | 'heroImage' | 'dateTape'>
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
          <EditionTheme
            as="h1"
            size="huge"
            theme={theme}
            themeHighlight={themeHighlight}
            delay="0.55s"
            className={tapeTheme}
          />
          <span className={styles.tapeEdition}>
            Bucharest Sculpture Days <span className={styles.editionSep}>/</span> ZSB {year}
          </span>
        </div>
      </div>
    </header>
  )
}
