import { css, cx } from 'styled-system/css'
import { token } from 'styled-system/tokens'
import { EditionTheme } from '@/components/EditionTheme/EditionTheme'
import { Figure } from '@/components/Figure/Figure'
import type { Edition } from '@/types/edition'
import { hero } from './Hero.recipe'

const styles = hero()

// Container positioning only — tuck the theme tape under the nav.
// (Entrance delay is a prop.)
const tapeTheme = css({ layerStyle: 'heroTapeNudge' })

// Mirrors `Hero.recipe.ts`'s `lg`+ grid (the image track beside the reserved
// tape column) so the browser's image selection agrees with the frame's
// actual rendered width.
const SIZES = `(min-width: ${token('sizes.breakpoint-lg')}) ${token('sizes.heroImageMax')}, 100vw`

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
            sizes={SIZES}
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
