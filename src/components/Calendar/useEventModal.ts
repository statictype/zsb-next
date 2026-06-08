'use client'

import { useCallback, useEffect, useMemo, useRef, useSyncExternalStore } from 'react'
import type { CalendarEvent } from '@/types/edition'
import { parseEventKey, withEventKey } from './calendar-filters'
import { getSearchSnapshot, getServerSnapshot, subscribeUrl, writeUrl } from './calendar-url'

// The open event is held in the URL (`?event=<key>`), so the modal survives a
// refresh and a link reopens it directly. Opening pushes a history entry so the
// Back gesture closes the modal; closing mirrors that — Back when we own the
// entry, otherwise strip the param (the case where the page was opened straight
// onto an event, with no entry of ours to pop). Reads share the calendar's URL
// store, so filters and the modal stay consistent.

export interface UseEventModal {
  /** The event named by `?event=` — null when closed, on the server, or if the key is stale. */
  activeEvent: CalendarEvent | null
  open: (key: string) => void
  close: () => void
}

export function useEventModal(events: CalendarEvent[]): UseEventModal {
  const search = useSyncExternalStore(subscribeUrl, getSearchSnapshot, getServerSnapshot)
  const key = search === null ? null : parseEventKey(search)
  const activeEvent = useMemo(
    () => (key === null ? null : (events.find((e) => e.key === key) ?? null)),
    [events, key],
  )

  // Whether the current `?event=` entry is one we pushed (vs. a direct landing).
  const owned = useRef(false)

  // Any back/forward navigation unwinds our pushed entry, so we no longer own one.
  useEffect(() => {
    const onPop = () => {
      owned.current = false
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  const open = useCallback((eventKey: string) => {
    writeUrl(withEventKey(window.location.search, eventKey), { push: true })
    owned.current = true
  }, [])

  const close = useCallback(() => {
    if (owned.current) {
      owned.current = false
      window.history.back()
    } else {
      writeUrl(withEventKey(window.location.search, null))
    }
  }, [])

  return { activeEvent, open, close }
}
