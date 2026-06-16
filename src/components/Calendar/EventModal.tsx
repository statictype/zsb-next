'use client'

import { RiArrowLeftLine, RiArrowRightUpLine } from '@remixicon/react'
import { useEffect, useRef } from 'react'
import { css, cx } from 'styled-system/css'
import { Figure } from '@/components/Figure/Figure'
import { Button } from '@/components/ui/Button/Button'
import { eventWhenLabel } from '@/lib/edition-dates'
import { useBodyScrollLock } from '@/lib/use-body-scroll-lock'
import type { CalendarEvent } from '@/types/edition'
import { eventModal } from './EventModal.recipe'
import { useShareLink } from './useShareLink'

// The Back/Share controls are plain ghost <Button>s floating over the dialog
// top; the click-through bar (`controls` slot) re-enables pointer-events on its
// buttons, so nothing is layered on top of the ghost variant here.
const shareIcon = css({
  '& svg': { transition: 'transform {durations.fast} {easings.quint}' },
  _hover: { '& svg': { transform: 'translateY(-2px)' } },
  '@media (prefers-reduced-motion: reduce)': { '& svg': { transition: 'none' } },
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

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'

export function EventModal({ event, onClose }: { event: CalendarEvent; onClose: () => void }) {
  const dialogRef = useRef<HTMLDivElement>(null)
  useBodyScrollLock(true)

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

  // Move focus into the dialog, trap Tab within it, close on Escape, and restore
  // focus to the opener on unmount — the keyboard/SR contract for a modal.
  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    const previouslyFocused = document.activeElement as HTMLElement | null
    const focusables = () => Array.from(dialog.querySelectorAll<HTMLElement>(FOCUSABLE))
    ;(focusables()[0] ?? dialog).focus()

    const onKeydown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
        return
      }
      if (e.key !== 'Tab') return
      const items = focusables()
      if (items.length === 0) {
        e.preventDefault()
        return
      }
      const first = items[0]!
      const last = items[items.length - 1]!
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeydown)
    return () => {
      document.removeEventListener('keydown', onKeydown)
      previouslyFocused?.focus?.()
    }
  }, [onClose])

  const titleId = `event-modal-${event.key}`
  const s = eventModal()

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: click-outside dismiss; Escape + Back button cover the keyboard
    <div
      className={s.backdrop}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        ref={dialogRef}
        className={s.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
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
          <h2 id={titleId} className={s.name}>
            {event.name}
          </h2>

          {event.types.length > 0 && (
            <ul className={s.types}>
              {event.types.map((t) => (
                <li key={t.slug} className={s.type}>
                  {t.title}
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
                <a className={s.link} href={event.ticketUrl} target="_blank" rel="noreferrer">
                  Tickets <RiArrowRightUpLine size={15} aria-hidden />
                </a>
              )}
              {event.facebookUrl && (
                <a className={s.link} href={event.facebookUrl} target="_blank" rel="noreferrer">
                  Facebook event <RiArrowRightUpLine size={15} aria-hidden />
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
