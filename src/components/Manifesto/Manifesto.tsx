import { cx } from 'styled-system/css'
import { Text } from 'styled-system/jsx'
import { editorialSplit } from 'styled-system/patterns'
import { section } from 'styled-system/recipes'
import { AccentSplit } from '@/components/AccentSplit/AccentSplit'
import { manifesto as styles } from '@/components/Manifesto/Manifesto.recipe'

interface ManifestoProps {
  title: string
  body: string
  accent?: string
  ground?: 'light' | 'dark'
  flush?: boolean
}

export function Manifesto({
  title,
  body,
  accent,
  ground = 'light',
  flush = false,
}: ManifestoProps) {
  const s = styles({ flush })

  return (
    <section className={cx(section({ ground, rhythm: 'lg' }), s.section)}>
      <div className={cx(editorialSplit({ xl: { gridTemplateColumns: '1fr 1fr' } }), s.container)}>
        <Text variant="manifesto" className={s.title}>
          <AccentSplit text={title} accent={accent} />
        </Text>
        <div className={s.content}>
          <Text as="p" variant="lead" maxWidth="measure">
            {body}
          </Text>
        </div>
      </div>
    </section>
  )
}
