import { venueLine } from '@program/VenueLine.recipe'
import { Text, Wrap } from 'styled-system/jsx'
import type { EventVenue } from '@/types/edition'

export function VenueLine({ venue }: { venue: EventVenue }) {
  const s = venueLine()
  return (
    <Wrap as="p">
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
