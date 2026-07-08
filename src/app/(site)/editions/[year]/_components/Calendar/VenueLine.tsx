import { cx } from 'styled-system/css'
import type { EventVenue } from '@/types/edition'
import { venueLine } from './VenueLine.recipe'

// The venue name + its rolled-up parent, shared by the agenda rows, the Ongoing
// run cards, and the event modal (DS-1). `size` picks the board vs. modal scale;
// `className` carries call-site spacing (e.g. the modal body's marginTop).
export function VenueLine({
  venue,
  size,
  className,
}: {
  venue: EventVenue
  size?: 'sm' | 'md' | undefined
  className?: string | undefined
}) {
  const s = venueLine({ size })
  return (
    <p className={cx(s.venue, className)}>
      <span className={s.name}>{venue.name}</span>
      {venue.partOf && <span className={s.parent}>{venue.partOf.name}</span>}
    </p>
  )
}
