import { DocumentsIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

export const pressPage = defineType({
  name: 'pressPage',
  title: 'Press',
  type: 'document',
  icon: DocumentsIcon,
  groups: [
    { name: 'hero', title: 'Hero', default: true },
    { name: 'kit', title: 'Media kit' },
  ],
  fields: [
    defineField({
      name: 'hero',
      title: 'Hero',
      type: 'pageHero',
      group: 'hero',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'mediaKitEyebrow',
      title: 'Media kit eyebrow',
      description:
        'Small label above the poster strip. The strip itself is derived from each edition\'s Press kit (poster + cover photo), newest year first.',
      type: 'string',
      group: 'kit',
      validation: (rule) => rule.required().max(40),
    }),
  ],
  preview: { prepare: () => ({ title: 'Press' }) },
})
