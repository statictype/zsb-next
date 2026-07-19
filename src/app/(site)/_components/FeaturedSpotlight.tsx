'use client'

import { FeaturedEvents } from '@/app/(site)/_components/FeaturedEvents'
import { isPastEvent } from '@/lib/edition-dates'
import { useTodayIso } from '@/lib/use-today-iso'
import type { CalendarEvent } from '@/types/edition'

// ZSB-44 owns which events the spotlight shows; FeaturedEvents stays look-only.
// This thin client wrapper hides past events against the visitor's own clock —
// the homepage is cached, so past-ness is judged client-side (ADR 0016, the same
// split the calendar uses). Before the clock resolves (the `null` server
// snapshot) every marked event shows, keeping the cached HTML and first client
// render in sync; React then drops the past ones. An all-past edition (the
// off-season case) collapses to nothing, which is intended.
export function FeaturedSpotlight({ year, events }: { year: number; events: CalendarEvent[] }) {
  const todayIso = useTodayIso()
  const visible = todayIso === null ? events : events.filter((e) => !isPastEvent(e, todayIso))
  return <FeaturedEvents year={year} events={visible} />
}
