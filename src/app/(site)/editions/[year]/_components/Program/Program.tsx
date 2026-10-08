'use client'

import { HashScroller } from '@program/HashScroller'
import { program } from '@program/Program.recipe'
import { ProgramBoard } from '@program/ProgramBoard'
import { ProgramProvider, useProgram } from '@program/ProgramContext'
import { ProgramFilters } from '@program/ProgramFilters'
import { ProgramShare } from '@program/ProgramShare'
import type { ProgramScope } from '@program/program-scope'
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
    <section className={section()} {...aria}>
      {/* Nav clearance comes from `scroll-padding-top` in globals.css. */}
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
  const { state, actions, meta } = useProgram()
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
      {meta.labels.pastToggle(showPast, past)}
    </Button>
  )
}

function ProgramMeta() {
  const { state, meta } = useProgram()
  const full = meta.scope.variant === 'full'
  if (!full && !state.view.showPastControl) return null

  return (
    <Wrap gap="md">
      {full && <ProgramCount />}
      <PastEventsToggle />
    </Wrap>
  )
}

function ProgramBody() {
  const { meta } = useProgram()
  return (
    <Stack gap="2xl">
      {meta.scope.variant === 'full' && <ProgramFilters />}
      <ProgramBoard />
    </Stack>
  )
}

function ProgramIntro({ paragraphs }: { paragraphs: string[] }) {
  if (paragraphs.length === 0) return null
  return (
    <Stack gap="sm" className={s.intro}>
      {paragraphs.map((p) => (
        <Text as="p" variant="caption" key={p}>
          {p}
        </Text>
      ))}
    </Stack>
  )
}

export function LiveProgram({ intro = [] }: { intro?: string[] }) {
  const { meta } = useProgram()
  return (
    <ProgramFrame aria-labelledby="program-heading">
      <Stack gap="xl">
        <Stack as="header" gap="md">
          <HStack justify="space-between" gap="md">
            <SectionHeading id="program-heading" flush>
              {meta.labels.heading}
            </SectionHeading>
            <ProgramShare />
          </HStack>
          <ProgramIntro paragraphs={intro} />
          <ProgramMeta />
        </Stack>
        <ProgramBody />
      </Stack>
    </ProgramFrame>
  )
}

export function FinishedProgram({ intro = [] }: { intro?: string[] }) {
  const { state, meta } = useProgram()
  const { total } = state
  const { labels } = meta

  return (
    <ProgramFrame aria-label={labels.heading}>
      <Stack gap="xl">
        <ProgramIntro paragraphs={intro} />
        <Collapsible
          id="program-archive"
          className={s.archive}
          closedLabel={labels.archiveClosed}
          openLabel={labels.archiveOpen}
          meta={labels.events(total)}
        >
          <ProgramBody />
        </Collapsible>
      </Stack>
    </ProgramFrame>
  )
}

function ProgramSection({ intro }: { intro: string[] }) {
  const { state } = useProgram()
  return state.view.ended ? <FinishedProgram intro={intro} /> : <LiveProgram intro={intro} />
}

interface ProgramProps {
  scope: ProgramScope
  events: CalendarEvent[]
  intro?: string[]
}

export function Program({ scope, events, intro = [] }: ProgramProps) {
  return (
    <ProgramProvider scope={scope} events={events}>
      <ProgramSection intro={intro} />
    </ProgramProvider>
  )
}
