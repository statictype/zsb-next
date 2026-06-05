import { defineField, defineType } from 'sanity'

/**
 * One editorial question/answer pair for the Visit-page FAQ. Used only for
 * questions the structured fields can't answer (tickets, accessibility, the
 * year-round venue) — the opening-hours and location entries are derived from
 * the existing fields at render time, so they never drift. Both the visible
 * FAQ and the `FAQPage` JSON-LD are built from the same merged list.
 *
 * Phrase questions the way a visitor would actually ask them — that matching
 * is what gets the page cited in AI answers and Google's FAQ results.
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
