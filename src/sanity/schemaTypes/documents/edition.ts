import { CalendarIcon } from '@sanity/icons'
import { defineArrayMember, defineField, defineType } from 'sanity'

export const edition = defineType({
  name: 'edition',
  title: 'Edition',
  type: 'document',
  icon: CalendarIcon,
  groups: [
    { name: 'hero', title: 'Hero', default: true },
    { name: 'manifesto', title: 'Manifesto' },
    { name: 'theme', title: 'Theme' },
    { name: 'artists', title: 'Artists' },
    { name: 'venues', title: 'Venues' },
    { name: 'program', title: 'Program' },
    { name: 'carousel', title: 'Carousel' },
    { name: 'pressKit', title: 'Press kit' },
    { name: 'credits', title: 'Credits' },
  ],
  fields: [
    defineField({
      name: 'year',
      title: 'Year',
      type: 'number',
      group: 'hero',
      validation: (rule) => rule.required().integer().min(2022).max(2100),
    }),
    defineField({
      name: 'status',
      title: 'Status',
      description:
        'Upcoming editions show on the homepage with a "Coming soon" badge instead of a link. Switch to Published once the edition page is ready to go live.',
      type: 'string',
      group: 'hero',
      options: {
        list: [
          { title: 'Upcoming', value: 'upcoming' },
          { title: 'Published', value: 'published' },
        ],
        layout: 'radio',
      },
      initialValue: 'upcoming',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'theme',
      title: 'Theme',
      description: 'Hashtag for the edition, e.g. "#celălaltcorp"',
      type: 'string',
      group: 'hero',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'themeHighlight',
      title: 'Theme highlight',
      description: 'Substring of the theme to emphasize visually',
      type: 'string',
      group: 'hero',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Page title',
      description: 'Browser tab / SEO title',
      type: 'string',
      group: 'hero',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'dateTape',
      title: 'Date tape',
      description:
        'Dates + venue line shown under the hero, e.g. "16.04-11.05 · Combinatul Fondului Plastic"',
      type: 'string',
      group: 'hero',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero image',
      type: 'image',
      group: 'hero',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt text',
          type: 'string',
          validation: (rule) => rule.required(),
        }),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'thumbImage',
      title: 'Thumbnail image',
      description: 'Optional. Used on the home page / edition cards. Falls back to hero image.',
      type: 'image',
      group: 'hero',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt text',
          type: 'string',
          validation: (rule) =>
            rule.custom((alt, context) => {
              const hasImage = Boolean((context.parent as { asset?: unknown } | undefined)?.asset)
              if (hasImage && !alt) return 'Alt text is required when a thumbnail is set'
              return true
            }),
        }),
      ],
    }),

    defineField({
      name: 'manifesto',
      title: 'Manifesto',
      type: 'object',
      group: 'manifesto',
      validation: (rule) => rule.required(),
      fields: [
        defineField({
          name: 'title',
          title: 'Title',
          description: 'Short manifesto phrase, e.g. "Forms that hold, not dominate"',
          type: 'string',
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: 'highlight',
          title: 'Highlight',
          description: 'Substring of the title to emphasize (may also be appended text)',
          type: 'string',
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: 'body',
          title: 'Body',
          type: 'text',
          rows: 6,
          validation: (rule) => rule.required(),
        }),
      ],
    }),

    defineField({
      name: 'themeSection',
      title: 'Theme section',
      type: 'object',
      group: 'theme',
      validation: (rule) => rule.required(),
      fields: [
        defineField({
          name: 'body',
          title: 'Body',
          description: 'Longer prose for the theme section. Renders as one paragraph.',
          type: 'text',
          rows: 8,
          validation: (rule) => rule.required(),
        }),
      ],
    }),

    defineField({
      name: 'artists',
      title: 'Artists',
      type: 'array',
      group: 'artists',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'artist' }] })],
      validation: (rule) => rule.required().min(1).unique(),
    }),

    defineField({
      name: 'venues',
      title: 'Venues',
      description: 'Optional. Populate once the venue list is finalized.',
      type: 'array',
      group: 'venues',
      of: [defineArrayMember({ type: 'venueEntry' })],
    }),

    defineField({
      name: 'program',
      title: 'Program',
      description: 'Optional. Populate once the program is announced.',
      type: 'programData',
      group: 'program',
    }),

    defineField({
      name: 'carousel',
      title: 'Carousel',
      description:
        'Optional. Press images / exhibition photography, typically added during or after the event.',
      type: 'array',
      group: 'carousel',
      of: [
        defineArrayMember({ type: 'slideFull' }),
        defineArrayMember({ type: 'slideDuo' }),
        defineArrayMember({ type: 'slideFeaturedPortrait' }),
        defineArrayMember({ type: 'slideTrio' }),
        defineArrayMember({ type: 'slideFeaturedStack' }),
      ],
    }),

    defineField({
      name: 'pressKit',
      title: 'Press kit',
      description:
        'Optional. Once published, the poster and cover photo appear in the Media kit strip on the Press page.',
      type: 'object',
      group: 'pressKit',
      fields: [
        defineField({
          name: 'poster',
          title: 'Official poster',
          description: 'The key visual for this edition.',
          type: 'image',
          options: { hotspot: true },
          fields: [
            defineField({
              name: 'alt',
              title: 'Alt text',
              type: 'string',
              validation: (rule) =>
                rule.custom((alt, context) => {
                  const hasImage = Boolean(
                    (context.parent as { asset?: unknown } | undefined)?.asset,
                  )
                  if (hasImage && !alt) return 'Alt text is required when a poster is set'
                  return true
                }),
            }),
          ],
        }),
        defineField({
          name: 'coverPhoto',
          title: 'Cover photo',
          description: 'A representative photograph from the exhibition.',
          type: 'image',
          options: { hotspot: true },
          fields: [
            defineField({
              name: 'alt',
              title: 'Alt text',
              type: 'string',
              validation: (rule) =>
                rule.custom((alt, context) => {
                  const hasImage = Boolean(
                    (context.parent as { asset?: unknown } | undefined)?.asset,
                  )
                  if (hasImage && !alt) return 'Alt text is required when a cover photo is set'
                  return true
                }),
            }),
          ],
        }),
      ],
    }),

    defineField({
      name: 'credits',
      title: 'Credits',
      type: 'array',
      group: 'credits',
      of: [
        defineArrayMember({ type: 'creditOrg' }),
        defineArrayMember({ type: 'creditOrgList' }),
        defineArrayMember({ type: 'creditText' }),
      ],
      validation: (rule) => rule.required().min(1),
    }),
  ],
  preview: {
    select: { year: 'year', theme: 'theme', media: 'heroImage' },
    prepare({ year, theme, media }) {
      return { title: year ? `ZSB ${year}` : 'Edition', subtitle: theme, media }
    },
  },
  orderings: [
    {
      title: 'Year, newest first',
      name: 'yearDesc',
      by: [{ field: 'year', direction: 'desc' }],
    },
  ],
})
