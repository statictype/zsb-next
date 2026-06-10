'use client'

import { useSyncExternalStore } from 'react'
import type { CalendarEvent } from '@/types/edition'
import { isPastEvent } from '../Calendar/calendar-filters'
import { FeaturedEvents } from './FeaturedEvents'

// ZSB-44 owns which events the spotlight shows; FeaturedEvents stays look-only.
// This thin client wrapper hides past events against the visitor's own clock —
// the homepage is cached, so past-ness is judged client-side (ADR 0016, the same
// split the calendar uses). Before the clock resolves (the `null` server
// snapshot) every marked event shows, keeping the cached HTML and first client
// render in sync; React then drops the past ones. An all-past edition (the
// off-season case) collapses to nothing, which is intended.
const subscribeNoop = () => () => {}

function getTodayIso(): string {
  const d = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

function useTodayIso(): string | null {
  return useSyncExternalStore(subscribeNoop, getTodayIso, () => null)
}

export function FeaturedSpotlight({ year, events }: { year: number; events: CalendarEvent[] }) {
  const todayIso = useTodayIso()
  const visible = todayIso === null ? events : events.filter((e) => !isPastEvent(e, todayIso))
  return <FeaturedEvents year={year} events={visible} />
}
