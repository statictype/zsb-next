import type { CustomValidator } from 'sanity'

/**
 * Not used by `edition.manifesto.highlight`: that highlight may be appended text that is
 * not a substring of the title.
 */
export function isSubstringOf(
  siblingField: string,
  siblingLabel: string,
): CustomValidator<string | undefined> {
  return (value, context) => {
    const sibling = (context.parent as Record<string, unknown> | undefined)?.[siblingField]
    if (typeof sibling !== 'string' || sibling === '') return true
    if (typeof value !== 'string' || value === '') return true
    return sibling.includes(value) || `Must appear as a substring of the ${siblingLabel}`
  }
}
