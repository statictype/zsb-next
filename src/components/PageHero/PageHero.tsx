import type { ReactNode } from 'react'
import { css, cx } from 'styled-system/css'
import { pageHero } from './PageHero.recipe'

interface PageHeroProps {
  /** The page title. Usually an <AccentSplit>, but any node is accepted. */
  title: ReactNode
  /** Optional standfirst below the title. */
  lead?: ReactNode
  /** Drop the hero's bottom padding when a section follows directly (the
   *  section's `sectionY` top becomes the single gap). */
  flush?: boolean
}

/**
 * The dark title block every top-level page opens with — a consistent start
 * position below the fixed nav, with the title animating in. Replaces the
 * `shared.pageHero` + `sectionInner` + `pageTitle` + `lead` markup that every
 * static page (about, partners, press, privacy, artists) repeated by hand.
 */
export function PageHero({ title, lead, flush }: PageHeroProps) {
  const styles = pageHero({ flush })
  return (
    <section className={styles.hero}>
      <div className={styles.inner}>
        <h1 className={cx(styles.title, css({ animationStyle: 'enter' }))}>{title}</h1>
        {lead != null && <p className={styles.lead}>{lead}</p>}
      </div>
    </section>
  )
}
