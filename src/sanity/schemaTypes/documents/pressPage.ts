import { defineField, defineType } from 'sanity'
import { DocumentsIcon } from '../../icons'
import { metaDescriptionField } from '../shared/metaDescriptionField'
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
    metaDescriptionField({ required: true }),
  ],
  preview: { prepare: () => ({ title: 'Press' }) },
})
