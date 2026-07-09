'use client'

import { RiArrowLeftLine } from '@remixicon/react'
import { cx } from 'styled-system/css'
import { HStack, Text, Wrap } from 'styled-system/jsx'
import { Figure } from '@/components/Figure/Figure'
import { Button } from '@/components/ui/Button/Button'
import { Dialog } from '@/components/ui/Dialog/Dialog'
import { eventWhenLabel } from '@/lib/edition-dates'
import type { CalendarEvent } from '@/types/edition'
import { eventModal } from './EventModal.recipe'
import { TypeChips } from './TypeChips'
import { shareCopied, shareIcon, useShareLink } from './useShareLink'
import { VenueLine } from './VenueLine'

// The Back/Share controls are plain secondary <Button>s floating over the
// dialog top; the click-through bar (`controls` slot) re-enables
// pointer-events on its buttons, so nothing is layered on top of them here.

// The full picture for a single event, opened from the calendar (ZSB-40). A
// dialog over the schedule: everything the agenda row summarises — the whole
// poster, the complete description, venue + grouping, type(s), date & time, and
// the ways to act on it. Rendered by the event route via `RoutedEventModal`
// (ADR 0015), which owns the close behaviour; mount == open.

export function EventModal({ event, onClose }: { event: CalendarEvent; onClose: () => void }) {
  // The event detail is its own route (ADR 0015), so the URL in the bar IS this
  // event's shareable URL — in both the intercepted (soft-nav) and standalone
  // (hard load) cases. Share it as-is; no fragment, unlike the calendar's
  // programme-anchored share (ZSB-50).
  const {
    share,
    copied,
    label: shareLabel,
    Icon: ShareIcon,
  } = useShareLink(() => window.location.href)

  const s = eventModal()

  return (
    <Dialog open onClose={onClose} title={event.name} presentation="panel">
      <HStack className={s.controls} justify="space-between">
        {/* Dismiss returns to the programme (router back / link up); ✕ was a
              generic close that no longer fits the route model (ZSB-50). */}
        <Button variant="secondary" size="sm" onClick={onClose}>
          <RiArrowLeftLine size={16} aria-hidden />
          Back to programme
        </Button>
        <Button
          variant="secondary"
          size="sm"
          className={cx(shareIcon, copied && shareCopied)}
          onClick={share}
          aria-live="polite"
        >
          <ShareIcon size={15} aria-hidden />
          {shareLabel}
        </Button>
      </HStack>

      {event.image && (
        <div className={s.poster}>
          <Figure image={event.image} sizes="(min-width: 768px) 340px, 100vw" />
        </div>
      )}

      <div className={s.body}>
        <Text as="p" variant="label" className={s.when}>
          {eventWhenLabel(event)}
        </Text>
        <Text as="h2" variant="title" className={s.name}>
          {event.name}
        </Text>

        <TypeChips types={event.types} className={s.types} />

        <VenueLine venue={event.venue} size="md" className={s.venue} />

        {event.description && (
          <Text as="p" variant="body" className={s.description}>
            {event.description}
          </Text>
        )}

        {(event.ticketUrl || event.facebookUrl) && (
          <Wrap className={s.links} gap="md">
            {event.ticketUrl && (
              <Button asChild variant="link">
                <a href={event.ticketUrl} target="_blank" rel="noreferrer">
                  Tickets
                </a>
              </Button>
            )}
            {event.facebookUrl && (
              <Button asChild variant="link">
                <a href={event.facebookUrl} target="_blank" rel="noreferrer">
                  Facebook event
                </a>
              </Button>
            )}
          </Wrap>
        )}
      </div>
    </Dialog>
  )
}
