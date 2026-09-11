'use client'

import { eventDetail } from '@program/EventDetail.recipe'
import { TypeChips } from '@program/TypeChips'
import { shareCopied, useShareLink } from '@program/useShareLink'
import { VenueLine } from '@program/VenueLine'
import { RiExternalLinkLine } from '@remixicon/react'
import { useCallback, useRef, useState } from 'react'
import { css } from 'styled-system/css'
import { Stack, Text } from 'styled-system/jsx'
import { Figure } from '@/components/Figure/Figure'
import { Lightbox } from '@/components/Lightbox/Lightbox'
import { Button } from '@/components/ui/Button/Button'
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

// Returns the split and the action row as siblings, so `EventModal` and
// `EventView` can each place them as their own rows.
export function EventDetail({ event, shell }: { event: CalendarEvent; shell: 'modal' | 'page' }) {
  const {
    share,
    copied,
    label: shareLabel,
    status: shareStatus,
    Icon: ShareIcon,
  } = useShareLink(() => window.location.href)
  const [zoomed, setZoomed] = useState(false)
  const posterRef = useRef<HTMLButtonElement>(null)
  const getPoster = useCallback(() => posterRef.current, [])

  const s = eventDetail({ shell, poster: !!event.image })
  const Name = shell === 'page' ? 'h1' : 'h2'

  return (
    <>
      <div className={s.layout}>
        {event.image && (
          <Button
            variant="plain"
            className={s.poster}
            ref={posterRef}
            onClick={() => setZoomed(true)}
            aria-label={`View the poster for ${event.name} full size`}
          >
            <Figure image={event.image} sizes="(min-width: 1024px) 38vw, 100vw" />
          </Button>
        )}

        <div className={s.column}>
          <div className={s.facts}>
            <Stack gap="sm">
              <Name className={s.name}>{event.name}</Name>
              <Stack gap="xs">
                <Text as="p" variant="body" className={s.when}>
                  {eventWhenLabel(event)}
                </Text>
                <VenueLine venue={event.venue} />
              </Stack>
            </Stack>

            {event.description && (
              <Text as="p" variant="body" className={s.description}>
                {event.description}
              </Text>
            )}

            <TypeChips types={event.types} className={s.types} />
          </div>
        </div>
      </div>

      <div className={s.actions}>
        <div className={s.act}>
          {event.facebookUrl && (
            <Button asChild variant="secondary" size="sm">
              <a href={event.facebookUrl} target="_blank" rel="noopener noreferrer">
                Event
                <NewTab />
              </a>
            </Button>
          )}
          {event.ticketUrl ? (
            <Button asChild variant="secondary" size="sm">
              <a href={event.ticketUrl} target="_blank" rel="noopener noreferrer">
                Tickets
                <NewTab />
              </a>
            </Button>
          ) : (
            <Text as="p" variant="label" className={s.freeEntry}>
              Free entry
            </Text>
          )}
        </div>

        <div className={s.take}>
          <Button
            variant="quiet"
            size="sm"
            className={copied ? shareCopied : undefined}
            onClick={share}
          >
            <ShareIcon size={15} aria-hidden />
            {shareLabel}
          </Button>
        </div>

        <span role="status" className={srOnly}>
          {shareStatus}
        </span>
      </div>

      {event.image && (
        <Lightbox
          images={[{ image: event.image }]}
          open={zoomed}
          index={0}
          getOrigin={getPoster}
          onClose={() => setZoomed(false)}
          onIndexChange={noStep}
        />
      )}
    </>
  )
}
