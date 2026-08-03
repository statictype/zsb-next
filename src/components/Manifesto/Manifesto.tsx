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
  size?: 'display' | 'title'
  flush?: boolean
}

export function Manifesto({
  title,
  body,
  accent,
  ground = 'light',
  size = 'display',
  flush = false,
}: ManifestoProps) {
  const s = styles({ size, flush })

  return (
    <section className={cx(section({ ground, rhythm: 'lg' }), s.section)}>
      <div
        className={cx(
          editorialSplit({
            xl: { gridTemplateColumns: size === 'title' ? '0.8fr 1.2fr' : '1fr 1fr' },
          }),
          s.container,
        )}
      >
        <Text variant={size} className={s.title}>
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
