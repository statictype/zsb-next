import type { Lang } from '@/types/edition'

export interface ProgramScope {
  lang: Lang
  programHref: string
  eventBase: string
  backLabel: string
  variant: 'full' | 'minimal'
}

export function scopeEventHref(scope: ProgramScope, slug: string): string {
  return `${scope.eventBase}/${slug}`
}
