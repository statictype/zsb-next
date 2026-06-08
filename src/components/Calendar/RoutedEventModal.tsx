'use client'

import { useRouter } from 'next/navigation'
import { useCallback } from 'react'
import type { CalendarEvent } from '@/types/edition'
import { EventModal } from './EventModal'

// Bridges the route-driven event detail (ADR 0015) to the presentational
// `EventModal`, supplying a close handler that matches how the modal was opened:
//   - intercepted (soft nav from the calendar): `router.back()` pops our pushed
//     entry, returning to the edition with its filters intact.
//   - standalone (hard load / shared link of the event URL): there's no entry of
//     ours to pop, so navigate up to the edition page.
export function RoutedEventModal({
  event,
  intercepted,
  editionHref,
}: {
  event: CalendarEvent
  intercepted: boolean
  editionHref: string
}) {
  const router = useRouter()
  const onClose = useCallback(() => {
    if (intercepted) router.back()
    else router.push(editionHref)
  }, [intercepted, editionHref, router])

  return <EventModal event={event} onClose={onClose} />
}
