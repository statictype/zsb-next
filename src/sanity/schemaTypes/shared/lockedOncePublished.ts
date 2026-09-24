import type { CustomValidatorResult, ValidationContext } from 'sanity'
import { apiVersion } from '@/sanity/env'

export function lockedOncePublished(path: string) {
  return async (value: unknown, context: ValidationContext): Promise<CustomValidatorResult> => {
    const id = context.document?._id.replace(/^drafts\./, '')
    if (!id) return true
    const published: unknown = await context
      .getClient({ apiVersion })
      .fetch(`*[_id == $id][0].${path}`, { id })
    if (published === null || published === undefined) return true
    const current =
      typeof value === 'object' && value !== null && 'current' in value ? value.current : value
    return current === published ? true : `Cannot change after publishing. Restore "${published}".`
  }
}
