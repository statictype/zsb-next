import { cx } from 'styled-system/css'
import { Text } from 'styled-system/jsx'
import { editorialSplit } from 'styled-system/patterns'
import { section } from 'styled-system/recipes'
import { manifesto as styles } from '@/components/Manifesto/Manifesto.recipe'
import { splitFirstMatch } from '@/lib/split-first-match'

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
        <Text variant="manifesto" className={s.title}>
          {titleParts ? (
            <>
              {titleParts.before}
              <span className={s.titleHighlight}>{titleParts.match}</span>
              {titleParts.after}
            </>
          ) : (
            title
          )}
        </Text>
        <div className={s.content}>
          <div className={s.text}>
            <Text as="p" variant="lead">
              {body}
            </Text>
          </div>
        </div>
      </div>
    </section>
  )
}
