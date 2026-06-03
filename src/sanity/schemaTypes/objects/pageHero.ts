import { defineField, defineType } from 'sanity'
import { isSubstringOf } from '../shared/substringValidator'

/**
 * Shared page-hero shape used on About, Partners, Visit, Privacy.
 * The hero on the Homepage is its own shape (it carries a CTA target
 * + slideshow), so it doesn't reuse this object.
 */
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
      name: 'titleAccent',
      title: 'Title — accented portion',
      description:
        'A substring of the title that gets the accent color. e.g. "ZSB" inside "About ZSB", or "s" inside "Partners".',
      type: 'string',
      validation: (rule) => rule.required().custom(isSubstringOf('title', 'title')),
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
