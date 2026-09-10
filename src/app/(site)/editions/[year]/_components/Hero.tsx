import { hero } from '@edition-components/Hero.recipe'
import type { ReactNode } from 'react'
import { css, cx } from 'styled-system/css'
import { Text } from 'styled-system/jsx'
import { Figure } from '@/components/Figure/Figure'
import { Tooltip } from '@/components/ui/Tooltip/Tooltip'
import type { Edition, EditionFact } from '@/types/edition'

const PHONE = '(max-width: 599.98px) and (orientation: portrait)'
// Only one of the two is ever displayed; the other is asked for at 1px.
const HERO_SIZES = `${PHONE} 1px, 100vw`
const THUMB_SIZES = `${PHONE} 100vw, 1px`

const HERO_INK_BY_YEAR: Record<number, 'black' | 'white'> = {
  2022: 'black',
  2024: 'black',
}

const FACT_LABELS: Record<EditionFact['kind'], string> = {
  dates: 'Dates',
  venue: 'Venue',
  artists: 'Artists',
  events: 'Events',
}

interface HeroProps {
  edition: Pick<Edition, 'year' | 'theme' | 'themeGloss' | 'heroImage' | 'thumbImage' | 'facts'>
}

export function Hero({ edition }: HeroProps) {
  const { year, theme, themeGloss, heroImage, thumbImage } = edition
  const ink = HERO_INK_BY_YEAR[year] ?? 'white'
  const styles = hero({ ink })

  const facts: { key: string; label: string; value: ReactNode }[] = [
    ...edition.facts.map((fact) => ({
      key: fact.kind,
      label: FACT_LABELS[fact.kind],
      value: fact.kind === 'dates' || fact.kind === 'venue' ? fact.text : String(fact.count),
    })),
    {
      key: 'theme',
      label: 'Theme',
      value: themeGloss ? <Tooltip label={themeGloss}>{theme}</Tooltip> : theme,
    },
  ]

  return (
    <header className={styles.hero}>
      <div className={styles.plate}>
        <div className={styles.frame}>
          <Figure
            image={heroImage}
            sizes={HERO_SIZES}
            preload
            className={cx(styles.image, css({ animationStyle: 'enter.zoom' }))}
          />
          <Figure
            image={thumbImage ?? heroImage}
            sizes={THUMB_SIZES}
            preload
            className={cx(styles.thumb, css({ animationStyle: 'enter.zoom' }))}
          />
        </div>
      </div>

      <div className={styles.inner}>
        <div className={styles.head}>
          <Text as="h1" variant="display" color="[currentColor]" className={styles.mast}>
            <span className={styles.prefix}>ZSB</span>
            {year}
          </Text>
        </div>

        <dl className={styles.ledger}>
          {facts.map((fact) => (
            <div key={fact.key} className={styles.row}>
              <Text as="dt" variant="label" color="[currentColor]" className={styles.rowLabel}>
                {fact.label}
              </Text>
              <Text as="dd" variant="caption" color="[currentColor]" className={styles.rowValue}>
                {fact.value}
              </Text>
            </div>
          ))}
        </dl>
      </div>
    </header>
  )
}
