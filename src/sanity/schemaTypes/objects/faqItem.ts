import { defineField, defineType } from 'sanity'

/**
 * Only for questions the structured fields cannot answer; the opening-hours and location
 * entries are derived at render time. The visible FAQ and the `FAQPage` JSON-LD use the
 * same merged list.
 */
export const faqItem = defineType({
  name: 'faqItem',
  title: 'Question',
  type: 'object',
  fields: [
    defineField({
      name: 'question',
      title: 'Question',
      description: 'Phrased as a visitor would ask it, e.g. "Do I need a ticket?".',
      type: 'string',
      validation: (rule) => rule.required().max(160),
    }),
    defineField({
      name: 'answer',
      title: 'Answer',
      description: 'A direct, self-contained answer. Plain text — no links or formatting.',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.required().max(600),
    }),
  ],
  preview: {
    select: { title: 'question', subtitle: 'answer' },
  },
})
