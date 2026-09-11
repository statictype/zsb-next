/**
 * The one place the `/editions/[year]` route template is written. Everything
 * else either receives an `href` stamped by the edition mappers (present iff
 * the edition is live — only live editions have pages) or calls this directly.
 * Client-safe on purpose: Studio presentation locations and client components
 * link to editions too.
 */
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
