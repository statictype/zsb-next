import { hero } from '@edition-components/Hero.recipe'
import { type RemixiconComponentType, RiCalendarLine, RiMapPinLine } from '@remixicon/react'
import { css, cx } from 'styled-system/css'
import { Text } from 'styled-system/jsx'
import { Figure } from '@/components/Figure/Figure'
import { Marquee } from '@/components/Marquee/Marquee'
import { portraitPhoneQuery } from '@/design-system/tokens'
import { formatDateRange } from '@/lib/edition-dates'
import type { Edition } from '@/types/edition'

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

const MARQUEE_SECONDS_PER_ITEM = 10

interface HeroFact {
  key: string
  label: string
  value: string
  icon: RemixiconComponentType
}

interface HeroProps {
  edition: Pick<
    Edition,
    'year' | 'theme' | 'heroImage' | 'thumbImage' | 'dateStart' | 'dateEnd' | 'facts' | 'manifesto'
  >
}

export function Hero({ edition }: HeroProps) {
  const { year, theme, heroImage, thumbImage, manifesto } = edition
  const ink = HERO_INK_BY_YEAR[year] ?? 'white'
  const align = HERO_ALIGN_BY_YEAR[year] ?? 'center'
  const styles = hero({ ink, align })

  const dates = formatDateRange(edition.dateStart, edition.dateEnd, { withYear: false })
  const facts: HeroFact[] = [
    ...(dates ? [{ key: 'dates', label: 'Dates', value: dates, icon: RiCalendarLine }] : []),
    ...edition.facts.flatMap((fact): HeroFact[] =>
      fact.kind === 'venue'
        ? [{ key: 'venue', label: 'Venue', value: fact.text, icon: RiMapPinLine }]
        : [],
    ),
  ]

  const marqueeItems = [
    { key: 'manifesto', label: 'Manifesto', value: manifesto.title },
    { key: 'theme', label: 'Theme', value: theme },
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
              {facts.map(({ key, label, value, icon: Icon }) => (
                <li key={key} className={styles.fact}>
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
          {marqueeItems.map(({ key, label, value }) => (
            <li key={key} className={styles.marqueeItem}>
              <span className={styles.srOnly}>{label}: </span>
              <Text as="span" variant="cardTitle" color="black" className={styles.marqueeText}>
                {value}
              </Text>
            </li>
          ))}
        </Marquee>
      </div>
    </div>
  )
}
