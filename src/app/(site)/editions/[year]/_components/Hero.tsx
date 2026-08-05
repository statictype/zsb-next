import { hero } from '@edition-components/Hero.recipe'
import { css, cx } from 'styled-system/css'
import { Text } from 'styled-system/jsx'
import { EditionTheme } from '@/components/EditionTheme/EditionTheme'
import { Figure } from '@/components/Figure/Figure'
import type { Edition } from '@/types/edition'

const styles = hero()

// Read off tokens.ts: the container caps at maxWidth 1800 + 2×gutter 112, and
// the plate is then (1800 − gridGap 84) / 2. Below `lg` it is the full rail.
const PLATE_SIZES = '(min-width: 2024px) 858px, (min-width: 1024px) 48vw, 90vw'

interface HeroProps {
  edition: Pick<
    Edition,
    | 'year'
    | 'theme'
    | 'themeHighlight'
    | 'heroImage'
    | 'dateRange'
    | 'venueLine'
    | 'artists'
    | 'events'
  >
}

export function Hero({ edition }: HeroProps) {
  const { year, theme, themeHighlight, heroImage, dateRange, venueLine } = edition
  const artistCount = edition.artists.length
  const eventCount = edition.events.length

  const facts: { key: string; label: string; value: string }[] = []
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

  return (
    <header className={styles.hero}>
      <div className={styles.inner}>
        <div className={styles.head}>
          <Text as="h1" variant="display" className={styles.mast}>
            <span className={styles.prefix}>ZSB</span>
            {year}
          </Text>

          <EditionTheme
            as="p"
            size="normal"
            accent="action"
            theme={theme}
            themeHighlight={themeHighlight}
            className={styles.theme}
          />
        </div>

        <div className={styles.plate}>
          <div className={styles.frame}>
            <Figure
              image={heroImage}
              sizes={PLATE_SIZES}
              preload
              className={cx(styles.image, css({ animationStyle: 'enter.zoom' }))}
            />
          </div>
        </div>

        {facts.length > 0 && (
          <dl className={styles.ledger}>
            {facts.map((fact) => (
              <div key={fact.key} className={styles.row}>
                <Text as="dt" variant="label" className={styles.rowLabel}>
                  {fact.label}
                </Text>
                <Text as="dd" variant="caption" className={styles.rowValue}>
                  {fact.value}
                </Text>
              </div>
            ))}
          </dl>
        )}
      </div>
    </header>
  )
}
