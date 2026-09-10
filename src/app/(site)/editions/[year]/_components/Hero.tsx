import { hero } from '@edition-components/Hero.recipe'
import type { ReactNode } from 'react'
import { css, cx } from 'styled-system/css'
import { Text } from 'styled-system/jsx'
import { Figure } from '@/components/Figure/Figure'
import { Tooltip } from '@/components/ui/Tooltip/Tooltip'
import type { Edition } from '@/types/edition'

const PHONE = '(max-width: 599.98px) and (orientation: portrait)'
// Only one of the two is ever displayed; the other is asked for at 1px.
const HERO_SIZES = `${PHONE} 1px, 100vw`
const THUMB_SIZES = `${PHONE} 100vw, 1px`

const HERO_INK_BY_YEAR: Record<number, 'black' | 'white'> = {
  2022: 'black',
  2024: 'black',
}

interface HeroProps {
  edition: Pick<
    Edition,
    | 'year'
    | 'theme'
    | 'themeGloss'
    | 'heroImage'
    | 'thumbImage'
    | 'dateRange'
    | 'venueLine'
    | 'artists'
    | 'events'
  >
}

export function Hero({ edition }: HeroProps) {
  const { year, theme, themeGloss, heroImage, thumbImage, dateRange, venueLine } = edition
  const ink = HERO_INK_BY_YEAR[year] ?? 'white'
  const styles = hero({ ink })
  const artistCount = edition.artists.length
  const eventCount = edition.events.length

  const facts: { key: string; label: string; value: ReactNode }[] = []
  if (dateRange) {
    facts.push({ key: 'dates', label: 'Dates', value: dateRange })
  }
  if (venueLine) {
    facts.push({ key: 'venue', label: 'Venue', value: venueLine })
  }
  if (artistCount > 0) {
    facts.push({ key: 'artists', label: 'Artists', value: String(artistCount) })
  }
  if (eventCount > 0) {
    facts.push({ key: 'events', label: 'Events', value: String(eventCount) })
  }
  facts.push({
    key: 'theme',
    label: 'Theme',
    value: themeGloss ? <Tooltip label={themeGloss}>{theme}</Tooltip> : theme,
  })

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
