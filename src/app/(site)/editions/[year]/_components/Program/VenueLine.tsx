import { venueLine } from '@program/VenueLine.recipe'
import { Text, Wrap } from 'styled-system/jsx'
import type { EventVenue } from '@/types/edition'

// The venue name + its rolled-up parent, shared by the day-by-day rows, the Ongoing
// run cards, and the event modal (DS-1). `className` carries call-site spacing
// (e.g. the modal body's marginTop).
export function VenueLine({
  venue,
  className,
}: {
  venue: EventVenue
  className?: string | undefined
}) {
  const s = venueLine()
  return (
    <Wrap as="p" className={className}>
      <Text variant="caption" className={s.name}>
        {venue.name}
      </Text>
      {venue.partOf && (
        <Text variant="label" className={s.parent}>
          {venue.partOf.name}
        </Text>
      )}
    </Wrap>
  )
}
