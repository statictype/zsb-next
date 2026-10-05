import { hero } from '@edition-components/Hero.recipe'
import type { ReactNode } from 'react'
import { css, cx } from 'styled-system/css'
import { Text } from 'styled-system/jsx'
import { Figure } from '@/components/Figure/Figure'
import { Tooltip } from '@/components/ui/Tooltip/Tooltip'
import { portraitPhoneQuery } from '@/design-system/tokens'
import type { Edition, EditionFact } from '@/types/edition'

// Only one of the two is ever displayed; the other is asked for at 1px.
const HERO_SIZES = `${portraitPhoneQuery} 1px, 100vw`
const THUMB_SIZES = `${portraitPhoneQuery} 100vw, 1px`

const HERO_INK_BY_YEAR: Record<number, 'black' | 'white'> = {
  2022: 'black',
  2024: 'black',
}

const HERO_ALIGN_BY_YEAR: Record<number, 'top' | 'center' | 'bottom'> = {
  2022: 'top',
  2023: 'center',
  2024: 'bottom',
}

const HERO_RULED_YEARS = [2022]

const FACT_LABELS: Record<Exclude<EditionFact['kind'], 'events'>, string> = {
  dates: 'Dates',
  venue: 'Venue',
  artists: 'Artists',
}

interface HeroProps {
  edition: Pick<Edition, 'year' | 'theme' | 'themeGloss' | 'heroImage' | 'thumbImage' | 'facts'>
}

export function Hero({ edition }: HeroProps) {
  const { year, theme, themeGloss, heroImage, thumbImage } = edition
  const ink = HERO_INK_BY_YEAR[year] ?? 'white'
  const align = HERO_ALIGN_BY_YEAR[year] ?? 'center'
  const styles = hero({ ink, align, ruled: HERO_RULED_YEARS.includes(year) })

  const facts: { key: string; label: string; value: ReactNode }[] = [
    ...edition.facts
      .filter((fact) => fact.kind !== 'events')
      .map((fact) => ({
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
        <Figure
          image={heroImage}
          sizes={HERO_SIZES}
          preload
          className={cx(styles.image, css({ animationStyle: 'enterZoom' }))}
        />
        <Figure
          image={thumbImage ?? heroImage}
          sizes={THUMB_SIZES}
          preload
          className={cx(styles.thumb, css({ animationStyle: 'enterZoom' }))}
        />
      </div>

      <div className={styles.inner}>
        <Text as="h1" variant="display" color="currentColor" className={styles.mast}>
          ZSB {year}
        </Text>

        <dl className={styles.ledger}>
          {facts.map((fact) => (
            <div key={fact.key} className={styles.row}>
              <Text as="dt" variant="label" color="currentColor" className={styles.rowLabel}>
                {fact.label}
              </Text>
              <Text as="dd" variant="caption" color="currentColor" className={styles.rowValue}>
                {fact.value}
              </Text>
            </div>
          ))}
        </dl>
      </div>
    </header>
  )
}
