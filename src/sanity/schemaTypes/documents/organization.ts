import { CaseIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

export const organization = defineType({
  name: 'organization',
  title: 'Organization',
  type: 'document',
  icon: CaseIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (rule) => rule.required().min(1).max(160),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name', maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      description: 'Optional. Used on edition pages and partner strips.',
      type: 'image',
      options: { hotspot: false },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt text',
          type: 'string',
          validation: (rule) =>
            rule.custom((alt, context) => {
              const hasImage = Boolean((context.parent as { asset?: unknown } | undefined)?.asset)
              if (hasImage && !alt) return 'Alt text is required when a logo is set'
              return true
            }),
        }),
      ],
    }),
    defineField({
      name: 'url',
      title: 'URL',
      description: 'Optional homepage / external link.',
      type: 'url',
      validation: (rule) => rule.uri({ scheme: ['http', 'https'] }),
    }),
  ],
  preview: {
    select: { title: 'name', media: 'logo' },
  },
})
