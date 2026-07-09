import { Wrap } from 'styled-system/jsx'
import { Badge } from '@/components/ui/Badge/Badge'
import type { EventTypeTag } from '@/types/edition'

// The event's type tags as outline badges — shared by the agenda rows, the
// Ongoing run cards, and the event modal (STRUCT-1). Renders nothing when there
// are no types, so an empty list never leaves a phantom flex gap. `className`
// carries call-site spacing (e.g. the modal body's marginTop).

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
          <Badge tone="outline">{t.title}</Badge>
        </li>
      ))}
    </Wrap>
  )
}
