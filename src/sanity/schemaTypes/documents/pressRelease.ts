import { defineField, defineType } from 'sanity'
import { TransferIcon } from '@/sanity/icons'

const LANGUAGES = [
  { title: 'English', value: 'EN' },
  { title: 'Romanian', value: 'RO' },
] as const

export const pressRelease = defineType({
  name: 'pressRelease',
  title: 'Press release',
  type: 'document',
  icon: TransferIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      description: 'e.g. "ZSB 2025 — #celălaltcorp Press Release".',
      type: 'string',
      validation: (rule) => rule.required().min(1).max(160),
    }),
    defineField({
      name: 'edition',
      title: 'Edition',
      description: 'Which edition this release covers. Upcoming editions are selectable too.',
      type: 'reference',
      to: [{ type: 'edition' }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published at',
      description: 'Release date — used for sort order and JSON-LD datePublished.',
      type: 'date',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'language',
      title: 'Language',
      type: 'string',
      options: { list: [...LANGUAGES], layout: 'radio' },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'pdf',
      title: 'PDF',
      type: 'file',
      options: { accept: 'application/pdf' },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'pages',
      title: 'Pages',
      description: 'Page count, shown alongside the file size on the press page.',
      type: 'number',
      validation: (rule) => rule.required().integer().min(1).max(500),
    }),
  ],
  preview: {
    select: { title: 'title', language: 'language', year: 'edition.year' },
    prepare: ({ title, language, year }) => ({
      title,
      subtitle: [year ? `ZSB ${year}` : null, language].filter(Boolean).join(' · '),
    }),
  },
  orderings: [
    {
      title: 'Published, newest first',
      name: 'publishedAtDesc',
      by: [
        { field: 'publishedAt', direction: 'desc' },
        { field: 'language', direction: 'asc' },
      ],
    },
  ],
})
