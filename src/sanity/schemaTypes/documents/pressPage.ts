import { DocumentsIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

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
  ],
  preview: { prepare: () => ({ title: 'Press' }) },
})
