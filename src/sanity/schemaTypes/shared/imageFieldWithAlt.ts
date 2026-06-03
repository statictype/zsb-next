import type { ImageRule } from 'sanity'
import { defineField } from 'sanity'

interface ImageFieldWithAltOptions {
  /** Field name, e.g. "heroImage", "poster", "logo". */
  name: string
  /** Field title shown in the Studio. */
  title: string
  /** Optional description under the image field. */
  description?: string
  /** Optional description under the nested Alt text field. */
  altDescription?: string
  /**
   * Noun used in the alt-required message:
   * "Alt text is required when {altNoun} is set". Defaults to "an image".
   */
  altNoun?: string
  /** Enable hotspot/crop. Defaults to true (false only for logos). */
  hotspot?: boolean
  /** Field group, for document-level fields. Omit for nested object fields. */
  group?: string
  /**
   * Presence validation for the image itself (e.g. `(rule) => rule.required()`
   * or a status-conditional `rule.custom(...)`). Omit to leave the image
   * optional. The nested alt-required check is always applied independently.
   */
  validation?: (rule: ImageRule) => ImageRule
}

/**
 * Builds an `image` field with hotspot and a nested, conditionally-required
 * `alt` field — the alt becomes required only once an asset is actually
 * uploaded. Deduplicates the pattern repeated across ~12 schema files.
 */
export function imageFieldWithAlt(opts: ImageFieldWithAltOptions) {
  const { name, title, description, altDescription, altNoun = 'an image', hotspot = true } = opts

  return defineField({
    name,
    title,
    type: 'image',
    ...(opts.group ? { group: opts.group } : {}),
    ...(description ? { description } : {}),
    options: { hotspot },
    fields: [
      defineField({
        name: 'alt',
        title: 'Alt text',
        type: 'string',
        ...(altDescription ? { description: altDescription } : {}),
        validation: (rule) =>
          rule.custom((alt, context) => {
            const hasImage = Boolean((context.parent as { asset?: unknown } | undefined)?.asset)
            if (hasImage && !alt) return `Alt text is required when ${altNoun} is set`
            return true
          }),
      }),
    ],
    ...(opts.validation ? { validation: opts.validation } : {}),
  })
}
