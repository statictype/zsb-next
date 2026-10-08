'use client'

import { FeaturedEvents } from '@site-components/FeaturedEvents'
import { isPastEvent } from '@/lib/edition-dates'
import { useTodayIso } from '@/lib/use-today-iso'
import type { CalendarEvent } from '@/types/edition'

export function FeaturedSpotlight({ year, events }: { year: number; events: CalendarEvent[] }) {
  const todayIso = useTodayIso()
  const visible = todayIso === null ? events : events.filter((e) => !isPastEvent(e, todayIso))
  return <FeaturedEvents year={year} events={visible} />
}
