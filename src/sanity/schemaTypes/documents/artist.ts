import { UserIcon } from '@sanity/icons'
import { defineArrayMember, defineField, defineType } from 'sanity'

export const artist = defineType({
  name: 'artist',
  title: 'Artist',
  type: 'document',
  icon: UserIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (rule) => rule.required().min(1).max(120),
    }),
    defineField({
      name: 'sortName',
      title: 'Sort name',
      description:
        'Hidden ordering key — surname first, e.g. "Popescu Marcel". The Name field is still what gets displayed. Auto-filled from Name; override for particles (van, de la) or double surnames.',
      type: 'string',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name', maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'portrait',
      title: 'Portrait',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt text',
          description: 'Describe the portrait for screen readers and SEO.',
          type: 'string',
          validation: (rule) =>
            rule.custom((alt, context) => {
              const hasImage = Boolean((context.parent as { asset?: unknown } | undefined)?.asset)
              if (hasImage && !alt) return 'Alt text is required when a portrait is set'
              return true
            }),
        }),
      ],
    }),
    defineField({
      name: 'shortBio',
      title: 'Short bio',
      type: 'array',
      of: [defineArrayMember({ type: 'block' })],
    }),
    defineField({
      name: 'discipline',
      title: 'Discipline',
      description: 'e.g. Sculpture, Installation, Mixed media',
      type: 'string',
    }),
    defineField({
      name: 'country',
      title: 'Country',
      description: 'Display label (e.g. Romania, Italy)',
      type: 'string',
    }),
    defineField({
      name: 'externalLinks',
      title: 'External links',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'externalLink',
          fields: [
            defineField({
              name: 'label',
              title: 'Label',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'url',
              title: 'URL',
              type: 'url',
              validation: (rule) => rule.required().uri({ scheme: ['http', 'https'] }),
            }),
          ],
          preview: { select: { title: 'label', subtitle: 'url' } },
        }),
      ],
    }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'discipline', media: 'portrait' },
  },
})
