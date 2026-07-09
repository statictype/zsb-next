import { cx } from 'styled-system/css'
import { Center } from 'styled-system/jsx'
import { Badge } from '@/components/ui/Badge/Badge'
import { Card } from '@/components/ui/Card/Card'
import { isdayBadge } from './IsdayBadge.recipe'

export function IsdayBadge({ className }: { className?: string | undefined }) {
  const s = isdayBadge()
  return (
    <Card ground="onLight" className={cx(s.card, className)}>
      <Center className={s.inner} flexDirection="column">
        <div className={s.title}>#ISDAY</div>
        <div className={s.subtitle}>International Sculpture Day</div>
        <Badge tone="outline" className={cx(s.pill)}>
          <span className={s.pillDot} />
          <span>Official Participant</span>
        </Badge>
      </Center>
    </Card>
  )
}
