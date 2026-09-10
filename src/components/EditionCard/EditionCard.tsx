import { RiArrowRightUpLine } from '@remixicon/react'
import Link from 'next/link'
import { Fragment, type ReactNode } from 'react'
import { cx } from 'styled-system/css'
import { Text } from 'styled-system/jsx'
import type { RecipeVariantProps } from 'styled-system/types'
import { editionCard } from '@/components/EditionCard/EditionCard.recipe'
import { EditionTheme } from '@/components/EditionTheme/EditionTheme'
import { Figure } from '@/components/Figure/Figure'
import type { EditionCardData, EditionFact } from '@/types/edition'

/** Bound to the recipe's variants: renaming or removing one there resurfaces
 *  here as a type error, not a silently ignored prop. */
type EditionCardMedia = NonNullable<RecipeVariantProps<typeof editionCard>>['media']

interface EditionCardProps {
  edition: EditionCardData
  href: string
  media?: EditionCardMedia
  preload?: boolean
  className?: string | undefined
}

// Read off tokens.ts: the container caps at maxWidth 1800 + 2×gutter 112, and
// the plate is then (1800 − gridGap 84) / 2. The last entry is the mobile
// thumbnail's own clamp ceiling, not a share of the viewport.
const PLATE_SIZES =
  '(min-width: 2024px) 858px, (min-width: 1024px) 48vw, (min-width: 768px) 90vw, 104px'

const COUNT_NOUNS = {
  artists: ['artist', 'artists'],
  events: ['event', 'events'],
} as const

export function EditionCard({
  edition,
  href,
  media = 'left',
  preload = false,
  className,
}: EditionCardProps) {
  const styles = editionCard({ media })

  const factContent = (fact: EditionFact): ReactNode => {
    if (fact.kind === 'dates' || fact.kind === 'venue') return fact.text
    const [singular, plural] = COUNT_NOUNS[fact.kind]
    return (
      <>
        <span className={styles.count}>{fact.count}</span> {fact.count === 1 ? singular : plural}
      </>
    )
  }

  return (
    <article className={cx(styles.root, className)}>
      <span className={styles.plate}>
        <span className={styles.frame}>
          <Figure
            image={edition.thumbImage ?? edition.heroImage}
            sizes={PLATE_SIZES}
            preload={preload}
            className={styles.image}
          />
        </span>
      </span>

      <div className={styles.body}>
        <Link href={href} className={styles.link} data-card-link>
          <div className={styles.head}>
            <Text as="h2" variant="title" className={styles.title}>
              <span className={styles.prefix}>ZSB</span> {edition.year}
              <span className={styles.arrow} aria-hidden>
                <RiArrowRightUpLine size={24} />
              </span>
            </Text>
            <EditionTheme
              as="p"
              size="sub"
              interactive
              theme={edition.theme}
              themeHighlight={edition.themeHighlight}
              className={styles.theme}
            />
          </div>

          {edition.facts.length > 0 && (
            <Text as="span" variant="caption">
              {edition.facts.map((fact, index) => (
                <Fragment key={fact.kind}>
                  {index > 0 ? ' · ' : null}
                  {factContent(fact)}
                </Fragment>
              ))}
            </Text>
          )}
        </Link>

        <Text as="p" variant="body" className={styles.prose}>
          {edition.themeBody}
        </Text>
      </div>
    </article>
  )
}
