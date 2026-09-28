import type { ProgramScope } from '@program/program-scope'
import { PROGRAM_SECTION_ID } from '@/lib/edition-href'

export const GALERIA_BELLER_PATH = '/galeria-beller'

export const BELLER_SECTION_IDS = { info: 'info', program: PROGRAM_SECTION_ID, artists: 'artisti' }

export const bellerProgramScope: ProgramScope = {
  lang: 'ro',
  programHref: `${GALERIA_BELLER_PATH}#${PROGRAM_SECTION_ID}`,
  eventBase: `${GALERIA_BELLER_PATH}/evenimente`,
  backLabel: 'Program',
  variant: 'minimal',
}

export function bellerEventHref(slug: string): string {
  return `${bellerProgramScope.eventBase}/${slug}`
}
