import { HeartIcon } from '@sanity/icons'
import { defineArrayMember, defineField, defineType } from 'sanity'
import { imageFieldWithAlt } from '../shared/imageFieldWithAlt'
import { isSubstringOf } from '../shared/substringValidator'

export const partnersPage = defineType({
  name: 'partnersPage',
  title: 'Partners',
  type: 'document',
  icon: HeartIcon,
  groups: [
    { name: 'hero', title: 'Hero', default: true },
    { name: 'event', title: 'The event' },
    { name: 'why', title: 'Why Sculpture' },
    { name: 'cta', title: 'Become a partner' },
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
      name: 'eventTitle',
      title: 'Section title',
      description: 'e.g. "The event"',
      type: 'string',
      group: 'event',
      validation: (rule) => rule.required().max(40),
    }),
    defineField({
      name: 'eventBody',
      title: 'Paragraphs',
      description:
        'Each entry is one paragraph. Reference stats inline (e.g. "Five editions, 137 artists, 230 works, over 8,000 visitors").',
      type: 'array',
      group: 'event',
      of: [defineArrayMember({ type: 'text', rows: 4 })],
      validation: (rule) => rule.required().min(1),
    }),
    imageFieldWithAlt({
      name: 'eventImage',
      title: 'Image',
      group: 'event',
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: 'whyEyebrow',
      title: 'Eyebrow',
      description: 'Small label above the section title.',
      type: 'string',
      group: 'why',
      validation: (rule) => rule.required().max(40),
    }),
    defineField({
      name: 'whyTitle',
      title: 'Section title',
      description: 'e.g. "The most resilient art form".',
      type: 'string',
      group: 'why',
      validation: (rule) => rule.required().max(80),
    }),
    imageFieldWithAlt({
      name: 'whyImage',
      title: 'Image',
      group: 'why',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'whyPoints',
      title: 'Points',
      description: 'Each numbered pillar in the grid. Numbers are derived from order.',
      type: 'array',
      group: 'why',
      of: [defineArrayMember({ type: 'whyPoint' })],
      validation: (rule) => rule.required().min(2).max(8),
    }),

    defineField({
      name: 'ctaHeading',
      title: 'Heading',
      description: 'CTA section title, e.g. "BECOME A PARTNER".',
      type: 'string',
      group: 'cta',
      validation: (rule) => rule.required().max(40),
    }),
    defineField({
      name: 'ctaHeadingAccent',
      title: 'Heading — accented portion',
      description: 'Substring of the heading that gets the accent color.',
      type: 'string',
      group: 'cta',
      validation: (rule) => rule.required().custom(isSubstringOf('ctaHeading', 'heading')),
    }),
    defineField({
      name: 'ctaBody',
      title: 'Body',
      type: 'text',
      rows: 4,
      group: 'cta',
      validation: (rule) => rule.required().max(360),
    }),
    defineField({
      name: 'ctaLabel',
      title: 'Button label',
      description: 'Mailto target comes from Site settings → Contact email.',
      type: 'string',
      group: 'cta',
      validation: (rule) => rule.required().max(40),
    }),
  ],
  preview: { prepare: () => ({ title: 'Partners' }) },
})
