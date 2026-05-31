import { defineField, defineType } from 'sanity'

/**
 * Partners-page "Why Sculpture" point. Same shape as pillar but kept
 * separate so the editor sees a context-specific label in the array
 * editor ("Why Sculpture point", not generic "Item").
 */
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
  ],
  preview: {
    select: { title: 'title', subtitle: 'text' },
  },
})
