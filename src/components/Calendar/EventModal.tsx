'use client'

import { RiArrowLeftLine } from '@remixicon/react'
import { css, cx } from 'styled-system/css'
import { Figure } from '@/components/Figure/Figure'
import { Badge } from '@/components/ui/Badge/Badge'
import { Button } from '@/components/ui/Button/Button'
import { Dialog } from '@/components/ui/Dialog/Dialog'
import { eventWhenLabel } from '@/lib/edition-dates'
import type { CalendarEvent } from '@/types/edition'
import { eventModal } from './EventModal.recipe'
import { useShareLink } from './useShareLink'

// The Back/Share controls are plain ghost <Button>s floating over the dialog
// top; the click-through bar (`controls` slot) re-enables pointer-events on its
// buttons, so nothing is layered on top of the ghost variant here.
const shareIcon = css({
  '& svg': { transition: 'transform {durations.fast} {easings.quint}' },
  _hover: { '& svg': { transform: 'translateY(-2px)' } },
  _motionReduce: { '& svg': { transition: 'none' } },
})
const shareCopied = css({
  color: 'highlight',
  borderColor: 'highlight',
  _hover: { color: 'highlight', borderColor: 'highlight' },
})

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
    <Dialog
      id={`event-${event.slug}`}
      open
      onClose={onClose}
      title={event.name}
      presentation="panel"
    >
      <div className={s.controls}>
        {/* Dismiss returns to the programme (router back / link up); ✕ was a
              generic close that no longer fits the route model (ZSB-50). */}
        <Button variant="ghost" size="sm" onClick={onClose}>
          <RiArrowLeftLine size={16} aria-hidden />
          Back to programme
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className={cx(shareIcon, copied && shareCopied)}
          onClick={share}
          aria-live="polite"
        >
          <ShareIcon size={15} aria-hidden />
          {shareLabel}
        </Button>
      </div>

      {event.image && (
        <div className={s.poster}>
          <Figure image={event.image} sizes="(min-width: 768px) 340px, 100vw" />
        </div>
      )}

      <div className={s.body}>
        <p className={s.when}>{eventWhenLabel(event)}</p>
        <h2 className={s.name}>{event.name}</h2>

        {event.types.length > 0 && (
          <ul className={s.types}>
            {event.types.map((t) => (
              <li key={t.slug}>
                <Badge tone="outline" size="sm">
                  {t.title}
                </Badge>
              </li>
            ))}
          </ul>
        )}

        <p className={s.venue}>
          <span className={s.venueName}>{event.venue.name}</span>
          {event.venue.partOf && <span className={s.venueParent}>{event.venue.partOf.name}</span>}
        </p>

        {event.description && <p className={s.description}>{event.description}</p>}

        {(event.ticketUrl || event.facebookUrl) && (
          <div className={s.links}>
            {event.ticketUrl && (
              <Button asChild variant="text">
                <a href={event.ticketUrl} target="_blank" rel="noreferrer">
                  Tickets
                </a>
              </Button>
            )}
            {event.facebookUrl && (
              <Button asChild variant="text">
                <a href={event.facebookUrl} target="_blank" rel="noreferrer">
                  Facebook event
                </a>
              </Button>
            )}
          </div>
        )}
      </div>
    </Dialog>
  )
}
