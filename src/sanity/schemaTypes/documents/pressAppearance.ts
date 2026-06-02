import { LinkIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

/**
 * Press coverage of ZSB — a single article, video, or audio segment.
 * `medium` is the editorial content type; the icon next to each row
 * is derived from the URL host (youtube/vimeo/soundcloud) with a
 * medium-based fallback for other outlets.
 */
const APPEARANCE_MEDIA = [
  { title: 'Article', value: 'article' },
  { title: 'Video', value: 'video' },
  { title: 'Audio', value: 'audio' },
] as const

export const pressAppearance = defineType({
  name: 'pressAppearance',
  title: 'Press appearance',
  type: 'document',
  icon: LinkIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      description: 'Headline of the piece, e.g. "Jurnal Cultural, TVR Cultural".',
      type: 'string',
      validation: (rule) => rule.required().min(1).max(160),
    }),
    defineField({
      name: 'medium',
      title: 'Medium',
      description: 'Editorial type of coverage. Drives the row label.',
      type: 'string',
      options: { list: [...APPEARANCE_MEDIA], layout: 'radio' },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'year',
      title: 'Year',
      type: 'number',
      validation: (rule) => rule.required().integer().min(2021).max(2100),
    }),
    defineField({
      name: 'tag',
      title: 'Tag',
      description: 'Short label shown next to the year, e.g. "interview", "TV".',
      type: 'string',
      validation: (rule) => rule.required().max(40),
    }),
    defineField({
      name: 'url',
      title: 'URL',
      description: 'Direct link to the article, video, or audio.',
      type: 'url',
      validation: (rule) => rule.required().uri({ scheme: ['http', 'https'] }),
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      description: 'Optional. One short quote or summary shown under the title.',
      type: 'text',
      rows: 3,
    }),
  ],
  preview: {
    select: { title: 'title', medium: 'medium', year: 'year', tag: 'tag' },
    prepare: ({ title, medium, year, tag }) => ({
      title,
      subtitle: [year, medium, tag].filter(Boolean).join(' · '),
    }),
  },
  orderings: [
    {
      title: 'Year, newest first',
      name: 'yearDesc',
      by: [
        { field: 'year', direction: 'desc' },
        { field: 'title', direction: 'asc' },
      ],
    },
  ],
})
