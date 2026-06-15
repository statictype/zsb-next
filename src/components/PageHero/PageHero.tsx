import type { ReactNode } from 'react'
import { pageHero } from './PageHero.recipe'

const styles = pageHero()

interface PageHeroProps {
  /** The page title. Usually an <AccentSplit>, but any node is accepted. */
  title: ReactNode
  /** Optional standfirst below the title. */
  lead?: ReactNode
}

/**
 * The dark title block every top-level page opens with — a consistent start
 * position below the fixed nav, with the title animating in. Replaces the
 * `shared.pageHero` + `sectionInner` + `pageTitle` + `lead` markup that every
 * static page (about, partners, press, privacy, artists) repeated by hand.
 */
export function PageHero({ title, lead }: PageHeroProps) {
  return (
    <section className={styles.hero}>
      <div className={styles.inner}>
        <h1 className={styles.title}>{title}</h1>
        {lead != null && <p className={styles.lead}>{lead}</p>}
      </div>
    </section>
  )
}
