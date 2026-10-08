import type { ProgramScope } from '@program/program-scope'

// Client-safe: Studio presentation locations and client components import this.
export function editionHref(year: number): string {
  return `/editions/${year}`
}

export const PROGRAM_SECTION_ID = 'program'

export function editionProgramHref(year: number): string {
  return `${editionHref(year)}#${PROGRAM_SECTION_ID}`
}

export function eventHref(year: number, slug: string): string {
  return `${editionHref(year)}/events/${slug}`
}

export function editionProgramScope(year: number): ProgramScope {
  return {
    lang: 'en',
    programHref: editionProgramHref(year),
    eventBase: `${editionHref(year)}/events`,
    backLabel: `${year} program`,
    variant: 'full',
  }
}
