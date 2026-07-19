'use client'

import { FeaturedEvents } from '@site-components/FeaturedEvents'
import { isPastEvent } from '@/lib/edition-dates'
import { useTodayIso } from '@/lib/use-today-iso'
import type { CalendarEvent } from '@/types/edition'

// ZSB-44 owns which events the spotlight shows; FeaturedEvents stays look-only.
// Hides past events on the daily-tier client clock (`lib/today.ts`); before it
// resolves every marked event shows. An all-past edition (the off-season case)
// collapses to nothing, which is intended.
export function FeaturedSpotlight({ year, events }: { year: number; events: CalendarEvent[] }) {
  const todayIso = useTodayIso()
  const visible = todayIso === null ? events : events.filter((e) => !isPastEvent(e, todayIso))
  return <FeaturedEvents year={year} events={visible} />
}
