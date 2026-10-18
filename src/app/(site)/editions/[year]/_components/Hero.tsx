import { hero } from '@edition-components/Hero.recipe'
import { RiCalendarLine, RiMapPinLine } from '@remixicon/react'
import { css, cx } from 'styled-system/css'
import { Text } from 'styled-system/jsx'
import { Figure } from '@/components/Figure/Figure'
import { Marquee } from '@/components/Marquee/Marquee'
import { formatDateRange } from '@/lib/edition-dates'
import type { Edition } from '@/types/edition'

// Only one of the two is ever displayed; the other is asked for at 1px.
const HERO_SIZES = '(max-width: 1023px) 1px, 100vw'
const THUMB_SIZES = '(max-width: 1023px) 100vw, 1px'

const HERO_INK_BY_YEAR: Record<number, 'black' | 'white'> = {
  2022: 'black',
  2024: 'black',
}

const HERO_ALIGN_BY_YEAR: Record<number, 'top' | 'center' | 'bottom'> = {
  2022: 'top',
  2023: 'center',
  2024: 'bottom',
}

const MARQUEE_SECONDS_PER_ITEM = 10

interface HeroProps {
  edition: Pick<
    Edition,
    | 'year'
    | 'theme'
    | 'heroImage'
    | 'thumbImage'
    | 'dateStart'
    | 'dateEnd'
    | 'venueLine'
    | 'manifesto'
  >
}

export function Hero({ edition }: HeroProps) {
  const { year, theme, heroImage, thumbImage, manifesto } = edition
  const ink = HERO_INK_BY_YEAR[year] ?? 'white'
  const align = HERO_ALIGN_BY_YEAR[year] ?? 'center'
  const styles = hero({ ink, align })

  const facts = [
    {
      label: 'Dates',
      value: formatDateRange(edition.dateStart, edition.dateEnd, { withYear: false }) ?? '',
      icon: RiCalendarLine,
    },
    { label: 'Venue', value: edition.venueLine, icon: RiMapPinLine },
  ].filter((fact) => fact.value)

  const marqueeItems = [
    { label: 'Manifesto', value: manifesto.title },
    { label: 'Theme', value: theme },
  ]

  return (
    <div className={styles.fold}>
      <header className={styles.hero}>
        <div className={styles.plate}>
          <Figure
            image={heroImage}
            sizes={HERO_SIZES}
            preload
            fetchPriority="high"
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
          <div className={styles.intro}>
            <Text as="h1" variant="display" color="currentColor" className={styles.mast}>
              ZSB {year}
            </Text>
            <ul className={styles.facts}>
              {facts.map(({ label, value, icon: Icon }) => (
                <li key={label} className={styles.fact}>
                  <Icon size={16} aria-hidden />
                  <span className={styles.srOnly}>{label}: </span>
                  <Text as="span" variant="caption" color="currentColor">
                    {value}
                  </Text>
                </li>
              ))}
            </ul>
          </div>

          <Text as="p" variant="lead" color="currentColor" className={styles.body}>
            {manifesto.body}
          </Text>
        </div>
      </header>

      <div className={styles.marquee}>
        <Marquee count={marqueeItems.length} gap="md" secondsPerItem={MARQUEE_SECONDS_PER_ITEM}>
          {marqueeItems.map(({ label, value }) => (
            <li key={label} className={styles.marqueeItem}>
              <span className={styles.srOnly}>{label}: </span>
              <Text as="span" variant="cardTitle" color="black">
                {value}
              </Text>
            </li>
          ))}
        </Marquee>
      </div>
    </div>
  )
}
