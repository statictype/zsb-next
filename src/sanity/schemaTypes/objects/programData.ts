import { defineArrayMember, defineField, defineType } from 'sanity'

const BLOCK_TYPES = [
  { title: 'Exhibition', value: 'Exhibition' },
  { title: 'Main Exhibition', value: 'Main Exhibition' },
  { title: 'Student Exhibition', value: 'Student Exhibition' },
  { title: 'Opening Event', value: 'Opening Event' },
  { title: 'Special Event', value: 'Special Event' },
  { title: 'Film Program', value: 'Film Program' },
  { title: 'Talks & Workshops', value: 'Talks & Workshops' },
] as const

const BLOCK_FORMATS = [
  { title: 'Roundtable', value: 'Roundtable' },
  { title: 'Workshop', value: 'Workshop' },
  { title: 'Open Studios', value: 'Open Studios' },
] as const

const programBlock = defineArrayMember({
  type: 'object',
  name: 'programBlock',
  title: 'Program block',
  fields: [
    defineField({
      name: 'type',
      title: 'Type',
      type: 'string',
      options: { list: [...BLOCK_TYPES] },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'dates',
      title: 'Dates',
      description: 'e.g. "April 11—28, 2024"',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'location',
      title: 'Location',
      description: 'Optional venue label',
      type: 'string',
    }),
    defineField({
      name: 'format',
      title: 'Format',
      description: 'Optional sub-type for Talks & Workshops',
      type: 'string',
      options: { list: [...BLOCK_FORMATS] },
    }),
    defineField({
      name: 'column',
      title: 'Column',
      description: 'Layout column the block renders in. Manual height-balancing.',
      type: 'number',
      options: {
        list: [
          { title: 'Column 1', value: 1 },
          { title: 'Column 2', value: 2 },
        ],
        layout: 'radio',
      },
      initialValue: 1,
      validation: (rule) => rule.required().integer().min(1).max(2),
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'type', meta: 'dates' },
    prepare({ title, subtitle, meta }) {
      return { title, subtitle: [subtitle, meta].filter(Boolean).join(' · ') }
    },
  },
})

const programFilm = defineArrayMember({
  type: 'object',
  name: 'programFilm',
  title: 'Film',
  fields: [
    defineField({
      name: 'date',
      title: 'Date',
      description: 'e.g. "Apr 13"',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'note',
      title: 'Note',
      type: 'string',
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'date' },
  },
})

export const programData = defineType({
  name: 'programData',
  title: 'Program',
  type: 'object',
  fields: [
    defineField({
      name: 'dates',
      title: 'Dates label',
      description: 'Headline string for the program section, e.g. "April 11—28"',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'blocks',
      title: 'Blocks',
      type: 'array',
      of: [programBlock],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: 'films',
      title: 'Films',
      type: 'array',
      of: [programFilm],
    }),
    defineField({
      name: 'sftfBanner',
      title: 'SFTF banner',
      description: 'Sculptors for the Future — the educational program callout',
      type: 'object',
      validation: (rule) => rule.required(),
      fields: [
        defineField({
          name: 'tag',
          title: 'Tag',
          type: 'string',
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: 'title',
          title: 'Title',
          type: 'string',
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: 'description',
          title: 'Description',
          type: 'text',
          rows: 3,
          validation: (rule) => rule.required(),
        }),
      ],
    }),
  ],
})
