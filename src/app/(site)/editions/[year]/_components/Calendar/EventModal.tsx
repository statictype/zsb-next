'use client'

import { eventModal } from '@calendar/EventModal.recipe'
import { TypeChips } from '@calendar/TypeChips'
import { useShareLink } from '@calendar/useShareLink'
import { VenueLine } from '@calendar/VenueLine'
import { RiArrowLeftLine, RiExternalLinkLine } from '@remixicon/react'
import { useState } from 'react'
import { css } from 'styled-system/css'
import { Stack, Text, Wrap } from 'styled-system/jsx'
import { Figure } from '@/components/Figure/Figure'
import { Lightbox } from '@/components/Lightbox/Lightbox'
import { Button } from '@/components/ui/Button/Button'
import { Dialog } from '@/components/ui/Dialog/Dialog'
import { eventWhenLabel } from '@/lib/edition-dates'
import type { CalendarEvent } from '@/types/edition'

const srOnly = css({ layerStyle: 'srOnly' })

// A single poster has nothing to step to; hoisted so the Lightbox's arrow-key
// effect isn't re-armed on every render.
const noStep = () => {}

function NewTab() {
  return (
    <>
      <RiExternalLinkLine size={14} aria-hidden />
      <span className={srOnly}> (opens in a new tab)</span>
    </>
  )
}

export function EventModal({
  event,
  intercepted,
  onClose,
}: {
  event: CalendarEvent
  intercepted: boolean
  onClose: () => void
}) {
  const {
    share,
    copied,
    failed,
    label: shareLabel,
    Icon: ShareIcon,
  } = useShareLink(() => window.location.href)
  const [zoomed, setZoomed] = useState(false)

  const s = eventModal({ poster: !!event.image })

  return (
    <>
      <Dialog
        open
        onClose={onClose}
        title={event.name}
        presentation="panel"
        size={event.image ? 'wide' : 'default'}
      >
        <Button variant="quiet" size="sm" className={s.back} onClick={onClose}>
          <RiArrowLeftLine size={16} aria-hidden />
          {intercepted ? 'Back to programme' : 'View full programme'}
        </Button>

        {event.image && (
          <Button
            variant="plain"
            className={s.poster}
            onClick={() => setZoomed(true)}
            aria-label={`View the poster for ${event.name} full size`}
          >
            <Figure image={event.image} sizes="(min-width: 768px) 440px, 100vw" />
          </Button>
        )}

        <div className={s.body}>
          <div className={s.content}>
            <Stack gap="lg">
              <Stack gap="md">
                <h2 className={s.name}>{event.name}</h2>
                <Stack gap="xs">
                  <Text as="p" variant="calendar" className={s.when}>
                    {eventWhenLabel(event)}
                  </Text>
                  <VenueLine venue={event.venue} />
                </Stack>
                <TypeChips types={event.types} />
              </Stack>

              {event.description && (
                <Text as="p" variant="body" className={s.description}>
                  {event.description}
                </Text>
              )}
            </Stack>
          </div>

          <Wrap className={s.actions} gap="sm" align="center">
            {event.ticketUrl && (
              <Button asChild variant="primary" size="md">
                <a href={event.ticketUrl} target="_blank" rel="noopener noreferrer">
                  Tickets
                  <NewTab />
                </a>
              </Button>
            )}
            {event.facebookUrl && (
              <Button asChild variant="secondary" size="sm">
                <a href={event.facebookUrl} target="_blank" rel="noopener noreferrer">
                  Facebook event
                  <NewTab />
                </a>
              </Button>
            )}
            <Button variant="quiet" size="sm" className={s.share} onClick={share}>
              <ShareIcon size={15} aria-hidden />
              {shareLabel}
            </Button>
            <span role="status" className={srOnly}>
              {failed
                ? "Couldn't copy the link — copy it from the address bar."
                : copied
                  ? 'Link copied'
                  : ''}
            </span>
          </Wrap>
        </div>
      </Dialog>

      {event.image && (
        <Lightbox
          images={[{ image: event.image }]}
          index={zoomed ? 0 : null}
          onClose={() => setZoomed(false)}
          onIndexChange={noStep}
        />
      )}
    </>
  )
}
