import { hero } from '@edition-components/Hero.recipe'
import { css, cx } from 'styled-system/css'
import { Text } from 'styled-system/jsx'
import { EditionTheme } from '@/components/EditionTheme/EditionTheme'
import { Figure } from '@/components/Figure/Figure'
import type { Edition } from '@/types/edition'

const styles = hero()

interface HeroProps {
  edition: Pick<Edition, 'theme' | 'themeHighlight' | 'heroImage' | 'dateLine'>
}

export function Hero({ edition }: HeroProps) {
  const { theme, themeHighlight, heroImage, dateLine } = edition

  return (
    <header className={styles.hero}>
      <div className={styles.stage}>
        <div className={styles.frame}>
          <div className={styles.background} aria-hidden="true" />
          <Figure
            image={heroImage}
            sizes="100vw"
            preload
            className={cx(styles.image, css({ animationStyle: 'enter.zoom' }))}
          />
          <div
            className={cx(styles.vignette, css({ animationStyle: 'enter.fade' }))}
            aria-hidden="true"
          />
        </div>
      </div>

      <div className={styles.intro}>
        <EditionTheme
          as="h1"
          size="huge"
          accent="action"
          theme={theme}
          themeHighlight={themeHighlight}
        />
        <Text as="p" variant="caption">
          {dateLine}
        </Text>
      </div>
    </header>
  )
}
