import type { ImageRule } from 'sanity'
import { defineField } from 'sanity'

interface ImageFieldWithAltOptions {
  name: string
  title: string
  description?: string
  altDescription?: string
  altNoun?: string
  hotspot?: boolean
  group?: string
  /** Presence validation for the image. The nested alt-required check always applies independently. */
  validation?: (rule: ImageRule) => ImageRule
}

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
