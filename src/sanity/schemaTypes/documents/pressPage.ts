import { DocumentsIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'
import { ogImageField } from '../shared/ogImageField'

export const pressPage = defineType({
  name: 'pressPage',
  title: 'Press',
  type: 'document',
  icon: DocumentsIcon,
  fields: [
    defineField({
      name: 'hero',
      title: 'Hero',
      type: 'pageHero',
      validation: (rule) => rule.required(),
    }),
    ogImageField(),
  ],
  preview: { prepare: () => ({ title: 'Press' }) },
})
