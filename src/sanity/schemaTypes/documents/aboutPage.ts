import { defineArrayMember, defineField, defineType } from 'sanity'
import { InfoOutlineIcon } from '@/sanity/icons'
import { imageFieldWithAlt } from '@/sanity/schemaTypes/shared/imageFieldWithAlt'
import { metaDescriptionField } from '@/sanity/schemaTypes/shared/metaDescriptionField'
import { ogImageField } from '@/sanity/schemaTypes/shared/ogImageField'

export const aboutPage = defineType({
  name: 'aboutPage',
  title: 'About',
  type: 'document',
  icon: InfoOutlineIcon,
  groups: [
    { name: 'hero', title: 'Hero', default: true },
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
      name: 'pillars',
      title: 'Pillars',
      description:
        'Numbered short essays under the carousel. Numbers (01, 02, …) are derived from the order of the list — no need to type them.',
      type: 'array',
      group: 'pillars',
      of: [defineArrayMember({ type: 'pillar' })],
      validation: (rule) => rule.required().min(1).max(6),
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
        'Optional gallery strip under the hero. Each slide picks a layout (full / duo / trio / featured) and the matching number of images.',
      type: 'array',
      group: 'carousel',
      of: [defineArrayMember({ type: 'carouselSlide' })],
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
