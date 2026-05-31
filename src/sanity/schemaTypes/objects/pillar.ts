import { defineField, defineType } from 'sanity'

/**
 * About-page pillar: numbered short essay. The number is derived from
 * the array index at render time so editors don't have to keep them
 * in sync if the order changes.
 */
export const pillar = defineType({
  name: 'pillar',
  title: 'Pillar',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'Label',
      description: 'Short question or heading, e.g. "Why now?"',
      type: 'string',
      validation: (rule) => rule.required().max(80),
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'text',
      rows: 5,
      validation: (rule) => rule.required().max(500),
    }),
  ],
  preview: {
    select: { title: 'label', subtitle: 'body' },
  },
})
