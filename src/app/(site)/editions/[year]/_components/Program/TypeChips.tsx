import { Wrap } from 'styled-system/jsx'
import { Badge } from '@/components/ui/Badge/Badge'
import type { EventTypeTag } from '@/types/edition'

export function TypeChips({
  types,
  className,
}: {
  types: EventTypeTag[]
  className?: string | undefined
}) {
  if (types.length === 0) return null
  return (
    <Wrap as="ul" className={className} listStyle="none">
      {types.map((t) => (
        <li key={t.slug}>
          <Badge tone="muted">{t.title}</Badge>
        </li>
      ))}
    </Wrap>
  )
}
