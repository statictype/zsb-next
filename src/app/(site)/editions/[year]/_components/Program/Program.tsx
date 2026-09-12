'use client'

import { HashScroller } from '@program/HashScroller'
import { program } from '@program/Program.recipe'
import { ProgramBoard } from '@program/ProgramBoard'
import { ProgramProvider, useProgram } from '@program/ProgramContext'
import { ProgramFilters } from '@program/ProgramFilters'
import { ProgramShare } from '@program/ProgramShare'
import type { ProgramFilterOptions } from '@program/program-filters'
import { RiHistoryLine } from '@remixicon/react'
import type { AriaAttributes, ReactNode } from 'react'
import { Container, HStack, Stack, Text, Wrap } from 'styled-system/jsx'
import { section } from 'styled-system/recipes'
import { Button } from '@/components/ui/Button/Button'
import { Collapsible } from '@/components/ui/Collapsible/Collapsible'
import { SectionHeading } from '@/components/ui/SectionHeading/SectionHeading'
import { PROGRAM_SECTION_ID } from '@/lib/edition-href'
import type { CalendarEvent } from '@/types/edition'

const s = program()

function ProgramFrame({ children, ...aria }: { children: ReactNode } & AriaAttributes) {
  return (
    <section className={section({ ground: 'dark', rhythm: 'joined' })} {...aria}>
      {/* Zero-size anchor, past the section's own top padding — a shared link
          scrolls here instead of landing on blank padding. Nav clearance
          comes from the page shell's `scroll-padding-top` (globals.css). */}
      <div id={PROGRAM_SECTION_ID} />
      <HashScroller id={PROGRAM_SECTION_ID} />
      <Container>{children}</Container>
    </section>
  )
}

function ProgramCount() {
  const { state } = useProgram()
  return (
    <Text variant="label" className={s.count} aria-live="polite">
      {state.view.countLabel}
    </Text>
  )
}

function PastEventsToggle() {
  const { state, actions } = useProgram()
  const { past, showPast, showPastControl } = state.view
  if (!showPastControl) return null

  return (
    <Button
      variant="secondary"
      size="sm"
      aria-pressed={showPast}
      onClick={() => actions.setShowPast(!showPast)}
    >
      <RiHistoryLine size={15} aria-hidden />
      {showPast ? 'Hide' : 'Show'} {past} past {past === 1 ? 'event' : 'events'}
    </Button>
  )
}

function ProgramBody() {
  return (
    <Stack gap="2xl">
      <ProgramFilters />
      <ProgramBoard />
    </Stack>
  )
}

export function LiveProgram() {
  return (
    <ProgramFrame aria-labelledby="program-heading">
      <Stack gap="xl">
        <Stack as="header" gap="md">
          <SectionHeading id="program-heading" flush>
            Program
          </SectionHeading>
          <HStack justify="space-between" alignItems="flex-start" gap="md">
            <Wrap gap="md">
              <ProgramCount />
              <PastEventsToggle />
            </Wrap>
            <ProgramShare />
          </HStack>
        </Stack>
        <ProgramBody />
      </Stack>
    </ProgramFrame>
  )
}

export function FinishedProgram() {
  const { state } = useProgram()
  const { total } = state

  return (
    <ProgramFrame aria-label="Program">
      <Stack gap="xl">
        <Collapsible
          id="program-archive"
          className={s.archive}
          closedLabel="Browse the full program"
          openLabel="Hide the full program"
          meta={`${total} ${total === 1 ? 'event' : 'events'}`}
        >
          <ProgramBody />
        </Collapsible>
      </Stack>
    </ProgramFrame>
  )
}

function ProgramSection() {
  const { state } = useProgram()
  return state.view.ended ? <FinishedProgram /> : <LiveProgram />
}

interface ProgramProps {
  year: number
  events: CalendarEvent[]
  filterOptions: ProgramFilterOptions
}

export function Program({ year, events, filterOptions }: ProgramProps) {
  return (
    <ProgramProvider year={year} events={events} filterOptions={filterOptions}>
      <ProgramSection />
    </ProgramProvider>
  )
}
