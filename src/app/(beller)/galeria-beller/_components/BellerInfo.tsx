import { bellerInfo } from '@beller/_components/BellerInfo.recipe'
import { Text } from 'styled-system/jsx'
import { section } from 'styled-system/recipes'

interface BellerInfoProps {
  title: string
  body: string
}

export function BellerInfo({ title, body }: BellerInfoProps) {
  const s = bellerInfo()

  return (
    <section data-ground="dark" className={section({ rhythm: 'normal' })}>
      <div className={s.split}>
        <Text variant="manifesto" className={s.title}>
          {title}
        </Text>
        <Text as="p" variant="lead" className={s.body}>
          {body}
        </Text>
      </div>
    </section>
  )
}
