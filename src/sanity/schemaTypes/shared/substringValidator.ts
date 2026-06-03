import type { CustomValidator } from 'sanity'

/**
 * Validates that the field's value appears as a substring of a sibling field
 * on the same object — used by the "accent" / "highlight" fields that render a
 * portion of a heading in the accent color by `split()`-ing the heading on
 * this substring (homepage hero, pageHero, partners CTA, edition theme).
 *
 * Empty values pass (both the field itself and the sibling) so it composes
 * with `.required()` or a status-conditional presence check.
 *
 * NB: `edition.manifesto.highlight` intentionally does NOT use this. Its
 * highlight may be appended text that isn't a substring of the title (the
 * Manifesto renderer supports that — `split()` returns the whole title and the
 * highlight span follows it), and live editions rely on that, so a substring
 * check would wrongly flag valid content.
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
