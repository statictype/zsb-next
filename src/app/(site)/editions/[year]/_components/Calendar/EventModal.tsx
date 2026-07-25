'use client'

import { eventModal } from '@calendar/EventModal.recipe'
import { TypeChips } from '@calendar/TypeChips'
import { shareCopied, useShareLink } from '@calendar/useShareLink'
import { VenueLine } from '@calendar/VenueLine'
import { RiArrowLeftLine } from '@remixicon/react'
import { HStack, Stack, Text, Wrap } from 'styled-system/jsx'
import { Figure } from '@/components/Figure/Figure'
import { Button } from '@/components/ui/Button/Button'
import { Dialog } from '@/components/ui/Dialog/Dialog'
import { eventWhenLabel } from '@/lib/edition-dates'
import type { CalendarEvent } from '@/types/edition'

export function EventModal({ event, onClose }: { event: CalendarEvent; onClose: () => void }) {
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
        <Button variant="quiet" size="sm" onClick={onClose}>
          <RiArrowLeftLine size={16} aria-hidden />
          Back to programme
        </Button>
        <Button
          variant="quiet"
          size="sm"
          className={copied ? shareCopied : undefined}
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
        <Stack gap="lg">
          <Stack gap="md">
            <Stack gap="sm">
              <Stack gap="xs">
                <Text as="p" variant="label" className={s.when}>
                  {eventWhenLabel(event)}
                </Text>
                <Text as="h2" variant="title">
                  {event.name}
                </Text>
              </Stack>
              <TypeChips types={event.types} />
              <VenueLine venue={event.venue} />
            </Stack>

            {event.description && (
              <Text as="p" variant="body" className={s.description}>
                {event.description}
              </Text>
            )}
          </Stack>

          {(event.ticketUrl || event.facebookUrl) && (
            <Wrap gap="md">
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
        </Stack>
      </div>
    </Dialog>
  )
}
