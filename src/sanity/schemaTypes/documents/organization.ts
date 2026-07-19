import { defineField, defineType } from 'sanity'
import { CaseIcon } from '../../icons'
import { imageFieldWithAlt } from '../shared/imageFieldWithAlt'

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
    imageFieldWithAlt({
      name: 'logo',
      title: 'Logo',
      description: 'Optional. Used on edition pages and partner strips.',
      hotspot: false,
      altNoun: 'a logo',
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
