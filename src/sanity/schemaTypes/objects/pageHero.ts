import { defineField, defineType } from 'sanity'

export const pageHero = defineType({
  name: 'pageHero',
  title: 'Hero',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      description: 'Page H1. Usually one or two words.',
      type: 'string',
      validation: (rule) => rule.required().max(60),
    }),
    defineField({
      name: 'lead',
      title: 'Lead',
      description: 'One short paragraph under the title.',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.required().max(280),
    }),
  ],
})
