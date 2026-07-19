import { defineField, defineType } from 'sanity'
import { DocumentsIcon } from '@/sanity/icons'
import { metaDescriptionField } from '@/sanity/schemaTypes/shared/metaDescriptionField'
import { ogImageField } from '@/sanity/schemaTypes/shared/ogImageField'

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
    metaDescriptionField({ required: true }),
  ],
  preview: { prepare: () => ({ title: 'Press' }) },
})
