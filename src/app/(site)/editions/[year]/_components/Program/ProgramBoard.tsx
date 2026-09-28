'use client'

import { program } from '@program/Program.recipe'
import { useProgram } from '@program/ProgramContext'
import { scopeEventHref } from '@program/program-scope'
import { TypeChips } from '@program/TypeChips'
import { VenueLine } from '@program/VenueLine'
import Link from 'next/link'
import { css } from 'styled-system/css'
import { Grid, HStack, Stack, Text, Wrap } from 'styled-system/jsx'
import { Figure } from '@/components/Figure/Figure'
import { Button } from '@/components/ui/Button/Button'
import { timeLabel } from '@/lib/edition-dates'
import type { CalendarListEvent } from '@/types/edition'

const s = program()

export function ProgramBoard() {
  const { state, actions, meta } = useProgram()
  const { visible, ongoing, days } = state.view
  const { labels } = meta

  if (visible.length === 0) {
    return (
      <div className={s.layout}>
        <Stack className={s.empty} role="status">
          <Text as="p" variant="heading" className={s.emptyText}>
            {labels.noMatches}
          </Text>
          <Button variant="secondary" size="sm" onClick={actions.reset}>
            {labels.showAll}
          </Button>
        </Stack>
      </div>
    )
  }

  return (
    <Stack className={s.layout} gap="2xl">
      {ongoing.length > 0 && (
        <Stack as="section" gap="md" aria-label={labels.ongoingRegion}>
          <Text as="h3" variant="label" className={s.bandLabel}>
            {labels.ongoing}
          </Text>
          <Grid as="ul" gap="md" columns={{ base: 1, md: 2, lg: 3, '4xl': 4 }} listStyle="none">
            {ongoing.map(({ event: run, past, range }) => {
              return (
                <li key={run.key} className={s.run} data-past={past}>
                  {run.image && (
                    <div className={s.runMedia}>
                      <Figure
                        image={run.image}
                        sizes="(min-width: 1280px) 360px, (min-width: 768px) 45vw, 90vw"
                      />
                    </div>
                  )}
                  <Stack className={s.runContent} gap="sm">
                    {meta.scope.variant === 'full' && <TypeChips types={run.types} />}
                    <Text as="h4" variant="body" color="heading" className={s.eventName}>
                      <Link
                        className={s.link}
                        href={scopeEventHref(meta.scope, run.slug)}
                        scroll={false}
                      >
                        {run.name}
                      </Link>
                    </Text>
                    <VenueLine venue={run.venue} />
                    {range && (
                      <Text className={s.runFoot} variant="label">
                        {range}
                      </Text>
                    )}
                  </Stack>
                </li>
              )
            })}
          </Grid>
        </Stack>
      )}

      {days.length > 0 && (
        <section aria-labelledby="program-day-by-day-heading">
          <h3 id="program-day-by-day-heading" className={css({ layerStyle: 'srOnly' })}>
            {labels.dayByDay}
          </h3>
          <ol className={s.dayByDay}>
            {days.map((day) => {
              return (
                <Stack
                  as="li"
                  key={day.iso}
                  className={s.day}
                  data-past={day.past}
                  data-today={day.today}
                  aria-current={day.today ? 'date' : undefined}
                >
                  <HStack
                    className={s.marker}
                    flexDirection={{ base: 'row', md: 'column' }}
                    alignItems={{ base: 'baseline', md: 'flex-end' }}
                    gap={{ base: 'md', md: 'sm' }}
                  >
                    <Text variant="label">{day.token.weekday}</Text>
                    <span className={s.markerDay}>{day.token.dayPadded}</span>
                    <Text variant="label">{day.token.month}</Text>
                  </HStack>
                  <ul className={s.events}>
                    {day.events.map((event) => (
                      <EventRow key={event.key} event={event} />
                    ))}
                  </ul>
                </Stack>
              )
            })}
          </ol>
        </section>
      )}
    </Stack>
  )
}

export function EventRow({ event }: { event: CalendarListEvent }) {
  const { meta } = useProgram()
  const time = timeLabel(event)
  const showTypes = meta.scope.variant === 'full' && event.types.length > 0
  const hasMeta = !!time || showTypes
  const poster = meta.scope.variant === 'full' ? event.image : undefined
  return (
    <li className={s.event} data-poster={!!poster}>
      <Stack className={s.eventBody} gap="sm">
        {hasMeta && (
          <Wrap>
            {time && (
              <Text variant="label" color="highlight" className={s.eventTime}>
                {time}
              </Text>
            )}
            {showTypes && <TypeChips types={event.types} />}
          </Wrap>
        )}
        <Text as="h4" variant="body" color="heading" className={s.eventName}>
          <Link className={s.link} href={scopeEventHref(meta.scope, event.slug)} scroll={false}>
            {event.name}
          </Link>
        </Text>
        <VenueLine venue={event.venue} />
        {event.description && (
          <Text as="p" variant="caption" className={s.eventDesc}>
            {event.description}
          </Text>
        )}
      </Stack>
      {poster && (
        <div className={s.poster}>
          <Figure image={poster} sizes="(min-width: 1280px) 240px, 70vw" />
        </div>
      )}
    </li>
  )
}
