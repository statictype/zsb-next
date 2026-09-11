import { Text } from 'styled-system/jsx'
import { section } from 'styled-system/recipes'
import { AccentSplit } from '@/components/AccentSplit/AccentSplit'
import { manifesto as styles } from '@/components/Manifesto/Manifesto.recipe'

interface ManifestoProps {
  title: string
  body: string
  accent?: string
  ground?: 'light' | 'dark'
}

export function Manifesto({ title, body, accent, ground = 'light' }: ManifestoProps) {
  const s = styles()

  return (
    <section className={section({ ground, rhythm: 'lg' })}>
      <div className={s.split}>
        <Text variant="manifesto">
          <AccentSplit text={title} accent={accent} />
        </Text>
        <Text as="p" variant="lead" className={s.body}>
          {body}
        </Text>
      </div>
    </section>
  )
}
