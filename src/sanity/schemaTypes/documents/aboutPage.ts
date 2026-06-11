import { InfoOutlineIcon } from '@sanity/icons'
import { defineArrayMember, defineField, defineType } from 'sanity'
import { imageFieldWithAlt } from '../shared/imageFieldWithAlt'
import { metaDescriptionField } from '../shared/metaDescriptionField'
import { ogImageField } from '../shared/ogImageField'

export const aboutPage = defineType({
  name: 'aboutPage',
  title: 'About',
  type: 'document',
  icon: InfoOutlineIcon,
  groups: [
    { name: 'hero', title: 'Hero', default: true },
    { name: 'notFestival', title: '"Not a festival"' },
    { name: 'pillars', title: 'Pillars' },
    { name: 'carousel', title: 'Carousel' },
    { name: 'curator', title: 'Curator letter' },
    { name: 'social', title: 'Social' },
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
      name: 'notFestivalTitle',
      title: 'Section title',
      description: 'e.g. "Not a festival" — renders as the big left-column heading.',
      type: 'string',
      group: 'notFestival',
      validation: (rule) => rule.required().max(40),
    }),
    defineField({
      name: 'notFestivalBody',
      title: 'Paragraphs',
      description: 'Each entry is one paragraph.',
      type: 'array',
      group: 'notFestival',
      of: [defineArrayMember({ type: 'text', rows: 3 })],
      validation: (rule) => rule.required().min(1),
    }),

    defineField({
      name: 'pillars',
      title: 'Pillars',
      description:
        'Numbered short essays under the prose section. Numbers (01, 02, …) are derived from the order of the list — no need to type them.',
      type: 'array',
      group: 'pillars',
      of: [defineArrayMember({ type: 'pillar' })],
      validation: (rule) => rule.required().min(1).max(6),
    }),
    imageFieldWithAlt({
      name: 'placeImage',
      title: 'Place image',
      description: 'Wide image under the pillars (the venue / context shot).',
      group: 'pillars',
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: 'carouselEyebrow',
      title: 'Eyebrow',
      description: 'Small label beside the carousel arrows, e.g. "Gallery".',
      type: 'string',
      group: 'carousel',
      initialValue: 'Gallery',
      validation: (rule) => rule.max(40),
    }),
    defineField({
      name: 'carousel',
      title: 'Carousel',
      description:
        'Optional gallery strip between the project section and the pillars. Each slide picks a layout (full / duo / trio / featured) and the matching number of images.',
      type: 'array',
      group: 'carousel',
      of: [defineArrayMember({ type: 'carouselSlide' })],
    }),

    defineField({
      name: 'curatorEyebrow',
      title: 'Eyebrow',
      description: 'Small label above the curator headline, e.g. "A word from the curator".',
      type: 'string',
      group: 'curator',
      validation: (rule) => rule.required().max(60),
    }),
    defineField({
      name: 'curatorHeadline',
      title: 'Headline',
      type: 'string',
      group: 'curator',
      validation: (rule) => rule.required().max(80),
    }),
    imageFieldWithAlt({
      name: 'curatorPortrait',
      title: 'Portrait',
      group: 'curator',
      altNoun: 'a portrait',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'curatorName',
      title: 'Curator name',
      type: 'string',
      group: 'curator',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'curatorRole',
      title: 'Curator role',
      description: 'e.g. "Curator, ZSB"',
      type: 'string',
      group: 'curator',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'curatorLetter',
      title: 'Letter — paragraphs',
      description: 'Each entry is one paragraph.',
      type: 'array',
      group: 'curator',
      of: [defineArrayMember({ type: 'text', rows: 4 })],
      validation: (rule) => rule.required().min(1),
    }),
    ogImageField({ group: 'social' }),
    metaDescriptionField({ group: 'social', required: true }),
  ],
  preview: { prepare: () => ({ title: 'About' }) },
})
