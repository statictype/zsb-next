import { defineArrayMember, defineField, defineType } from 'sanity'
import { StarIcon } from '@/sanity/icons'
import { imageFieldWithAlt } from '@/sanity/schemaTypes/shared/imageFieldWithAlt'
import { metaDescriptionField } from '@/sanity/schemaTypes/shared/metaDescriptionField'
import { ogImageField } from '@/sanity/schemaTypes/shared/ogImageField'

export const galeriaBeller = defineType({
  name: 'galeriaBeller',
  title: 'Galeria Beller',
  type: 'document',
  icon: StarIcon,
  groups: [
    { name: 'hero', title: 'Hero', default: true },
    { name: 'info', title: 'Info' },
    { name: 'program', title: 'Program' },
    { name: 'artists', title: 'Artiști' },
    { name: 'credits', title: 'Credits' },
    { name: 'pressKit', title: 'Press kit' },
    { name: 'site', title: 'Footer' },
    { name: 'social', title: 'Social' },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      description: 'The event name. Used as the page title and as the text of the wordmark.',
      type: 'string',
      group: 'hero',
      initialValue: 'Galeria Beller',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'heroColor',
      title: 'Hero background colour',
      description: 'Hex colour, e.g. #e89124.',
      type: 'string',
      group: 'hero',
      initialValue: '#e89124',
      validation: (rule) =>
        rule
          .required()
          .regex(/^#[0-9a-fA-F]{6}$/, { name: 'hex colour' })
          .error('Use a 6-digit hex colour, e.g. #e89124'),
    }),
    imageFieldWithAlt({
      name: 'wordmark',
      title: 'Wordmark',
      description: 'The "Galeria Beller" lettering, black on transparent (PNG or SVG).',
      altNoun: 'the wordmark',
      hotspot: false,
      group: 'hero',
      validation: (rule) => rule.required(),
    }),
    imageFieldWithAlt({
      name: 'keyVisual',
      title: 'Key visual',
      description: 'The main image, on a transparent background (PNG).',
      altNoun: 'the key visual',
      hotspot: false,
      group: 'hero',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'facts',
      title: 'Facts',
      description: 'The rows under the wordmark. The artist count comes from the Artiști list.',
      type: 'object',
      group: 'hero',
      options: { collapsible: false },
      fields: [
        defineField({
          name: 'period',
          title: 'Perioada',
          description: 'e.g. 3–4 octombrie 2026',
          type: 'string',
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: 'location',
          title: 'Locație',
          type: 'string',
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: 'theme',
          title: 'Temă',
          type: 'string',
          validation: (rule) => rule.required(),
        }),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'info',
      title: 'Info',
      type: 'object',
      group: 'info',
      options: { collapsible: false },
      fields: [
        defineField({
          name: 'title',
          title: 'Title',
          type: 'string',
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: 'body',
          title: 'Text',
          description: 'Separate paragraphs with an empty line.',
          type: 'text',
          rows: 8,
          validation: (rule) => rule.required(),
        }),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'programIntro',
      title: 'Program intro',
      description:
        'Optional. Small text under the Program heading. Separate paragraphs with an empty line.',
      type: 'text',
      rows: 4,
      group: 'program',
    }),
    defineField({
      name: 'events',
      title: 'Events',
      description: "Order doesn't matter — the program sorts by date and time.",
      type: 'array',
      group: 'program',
      of: [defineArrayMember({ type: 'event' })],
    }),
    defineField({
      name: 'artists',
      title: 'Artiști',
      description: 'Artists with works in Studio link to their artist page.',
      type: 'array',
      group: 'artists',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'artist' }] })],
      validation: (rule) => rule.unique(),
    }),
    defineField({
      name: 'credits',
      title: 'Credits',
      description: 'Partners, curator, organizers. Rows show in this order.',
      type: 'array',
      group: 'credits',
      of: [
        defineArrayMember({ type: 'creditOrg' }),
        defineArrayMember({ type: 'creditOrgList' }),
        defineArrayMember({ type: 'creditText' }),
      ],
    }),
    defineField({
      name: 'pressKit',
      title: 'Press kit',
      description: 'The download section appears on the page once a file is uploaded.',
      type: 'object',
      group: 'pressKit',
      options: { collapsible: false },
      fields: [
        defineField({
          name: 'title',
          title: 'Title',
          type: 'string',
          initialValue: 'Press kit',
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: 'body',
          title: 'Text',
          description: 'Optional. One or two sentences above the button.',
          type: 'text',
          rows: 3,
        }),
        defineField({
          name: 'buttonLabel',
          title: 'Button label',
          type: 'string',
          initialValue: 'Descarcă press kit-ul',
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: 'file',
          title: 'Zip file',
          type: 'file',
          options: { accept: '.zip,application/zip' },
        }),
      ],
    }),
    defineField({
      name: 'footerText',
      title: 'Footer text',
      description: 'Optional. A line in the footer, e.g. the closing line of the program.',
      type: 'string',
      group: 'site',
    }),
    ogImageField({ group: 'social' }),
    metaDescriptionField({ group: 'social' }),
  ],
  preview: {
    select: { title: 'title', media: 'keyVisual' },
  },
})
