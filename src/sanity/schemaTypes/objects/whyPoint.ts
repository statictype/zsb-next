import { defineField, defineType } from 'sanity'
import { imageFieldWithAlt } from '@/sanity/schemaTypes/shared/imageFieldWithAlt'

export const whyPoint = defineType({
  name: 'whyPoint',
  title: 'Why Sculpture point',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required().max(80),
    }),
    defineField({
      name: 'text',
      title: 'Text',
      type: 'text',
      rows: 4,
      validation: (rule) => rule.required().max(500),
    }),
    imageFieldWithAlt({
      name: 'image',
      title: 'Image',
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'text', media: 'image' },
  },
})
