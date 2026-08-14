'use client'

import { EventModal } from '@program/EventModal'
import type { EventSteps } from '@program/event-steps'
import { useRouter } from 'next/navigation'
import type { CalendarEvent } from '@/types/edition'

// Only the `@modal` slot renders this, and it only fills on a soft navigation
// from the edition page — so there is always an entry of ours to pop.
export function RoutedEventModal({
  event,
  year,
  ...steps
}: {
  event: CalendarEvent
  year: number
} & EventSteps) {
  const router = useRouter()

  return <EventModal event={event} year={year} onClose={() => router.back()} {...steps} />
}
