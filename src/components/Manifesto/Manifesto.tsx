import { cx } from 'styled-system/css'
import { editorialSplit } from 'styled-system/patterns'
import { section } from 'styled-system/recipes'
import { splitFirstMatch } from '@/lib/split-first-match'
import { manifesto as styles } from './Manifesto.recipe'

interface ManifestoProps {
  title: string
  /** Single intro paragraph. */
  body: string
  /** Optional highlighted substring of the title (the accent). Omit for none. */
  accent?: string | undefined
}

export function Manifesto({ title, body, accent }: ManifestoProps) {
  const titleParts = accent ? splitFirstMatch(title, accent) : null
  const s = styles()

  return (
    <section className={cx(section({ ground: 'light', rhythm: 'lg' }), s.section)}>
      <div className={cx(editorialSplit(), s.container)}>
        <h2 className={s.title}>
          {titleParts ? (
            <>
              {titleParts.before}
              <span className={s.titleHighlight}>{titleParts.match}</span>
              {titleParts.after}
            </>
          ) : (
            title
          )}
        </h2>
        <div className={s.content}>
          <div className={s.text}>
            <p>{body}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
