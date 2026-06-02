import { LinkIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

/**
 * Press coverage of ZSB — a single article, video, podcast, or
 * broadcast segment. The `type` value drives which icon the renderer
 * shows next to each row; keeping the list fixed prevents editors from
 * picking icons we can't render. See the `TYPE_META` map on the press
 * page for the icon mapping.
 */
const APPEARANCE_TYPES = [
  { title: 'YouTube video', value: 'youtube' },
  { title: 'Vimeo video', value: 'vimeo' },
  { title: 'SoundCloud / podcast', value: 'soundcloud' },
  { title: 'Article', value: 'article' },
  { title: 'TV / broadcast', value: 'tv' },
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
      name: 'type',
      title: 'Type',
      description: 'Drives which icon shows next to this row on the press page.',
      type: 'string',
      options: { list: [...APPEARANCE_TYPES] },
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
    select: { title: 'title', type: 'type', year: 'year', tag: 'tag' },
    prepare: ({ title, type, year, tag }) => ({
      title,
      subtitle: [year, type, tag].filter(Boolean).join(' · '),
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
