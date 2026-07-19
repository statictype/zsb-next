import { cx } from 'styled-system/css'
import { Text } from 'styled-system/jsx'
import { editorialSplit } from 'styled-system/patterns'
import { section } from 'styled-system/recipes'
import { AccentSplit } from '@/components/AccentSplit/AccentSplit'
import { manifesto as styles } from '@/components/Manifesto/Manifesto.recipe'

interface ManifestoProps {
  title: string
  body: string
  accent?: string | undefined
}

export function Manifesto({ title, body, accent }: ManifestoProps) {
  const s = styles()

  return (
    <section className={cx(section({ ground: 'light', rhythm: 'lg' }), s.section)}>
      <div className={cx(editorialSplit(), s.container)}>
        <Text variant="manifesto" className={s.title}>
          <AccentSplit text={title} accent={accent} className={s.titleHighlight} />
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
