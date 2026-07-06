import { css, cx } from 'styled-system/css'
import { EditionTheme } from '@/components/EditionTheme/EditionTheme'
import { Figure } from '@/components/Figure/Figure'
import type { Edition } from '@/types/edition'
import { hero } from './Hero.recipe'

const styles = hero()

// Container positioning only — tuck the theme tape under the nav.
// (Entrance delay is a prop.)
const tapeTheme = css({
  marginLeft: { base: '10px', md: '18px', lg: '-36px', xl: '-40px' },
})

interface HeroProps {
  edition: Pick<Edition, 'theme' | 'themeHighlight' | 'heroImage' | 'dateTape'>
}

export function Hero({ edition }: HeroProps) {
  const { theme, themeHighlight, heroImage, dateTape } = edition

  return (
    <header className={styles.hero}>
      <div className={styles.stage}>
        <div className={styles.frame}>
          <div className={styles.background} aria-hidden="true" />
          <Figure
            image={heroImage}
            sizes="(min-width: 1024px) calc(100vw - 200px), 100vw"
            priority
            className={cx(styles.image, css({ animationStyle: 'enter.zoom' }))}
          />
          <div
            className={cx(styles.vignette, css({ animationStyle: 'enter.fade' }))}
            aria-hidden="true"
          />
        </div>

        <div className={styles.tapes}>
          <EditionTheme
            as="h1"
            size="huge"
            accent="action"
            theme={theme}
            themeHighlight={themeHighlight}
            meta={dateTape}
            delay="0.55s"
            className={tapeTheme}
          />
        </div>
      </div>
    </header>
  )
}
