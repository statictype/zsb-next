import { CalendarIcon } from '@sanity/icons'
import { defineArrayMember, defineField, defineType } from 'sanity'

// Conditional required: an `upcoming` edition can be saved with only
// year, status, and theme set; everything else is filled in over time
// and only enforced when the editor flips status to `live`.
function requiredWhenLive(value: unknown, context: { document?: unknown }): true | string {
  const status = (context.document as { status?: string } | undefined)?.status
  if (status !== 'live') return true
  if (value === undefined || value === null) return 'Required when status is Live'
  if (typeof value === 'string' && !value.trim()) return 'Required when status is Live'
  if (Array.isArray(value) && value.length === 0) return 'Required when status is Live'
  return true
}

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
        'Upcoming editions show on the homepage with a "Coming soon" badge instead of a link. Switch to Live once the edition page is ready and should be reachable. ("Live" is distinct from Sanity\'s own publish/draft state — a published document can still be an Upcoming edition.)',
      type: 'string',
      group: 'hero',
      options: {
        list: [
          { title: 'Upcoming', value: 'upcoming' },
          { title: 'Live', value: 'live' },
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
      validation: (rule) => rule.custom(requiredWhenLive),
    }),
    defineField({
      name: 'title',
      title: 'Page title',
      description: 'Browser tab / SEO title',
      type: 'string',
      group: 'hero',
      validation: (rule) => rule.custom(requiredWhenLive),
    }),
    defineField({
      name: 'dateTape',
      title: 'Date tape',
      description:
        'Dates + venue line shown under the hero, e.g. "16.04-11.05 · Combinatul Fondului Plastic"',
      type: 'string',
      group: 'hero',
      validation: (rule) => rule.custom(requiredWhenLive),
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
          // Alt is required whenever an image is actually uploaded, regardless of edition status.
          validation: (rule) =>
            rule.custom((alt, context) => {
              const hasImage = Boolean((context.parent as { asset?: unknown } | undefined)?.asset)
              if (hasImage && !alt) return 'Alt text is required when a hero image is set'
              return true
            }),
        }),
      ],
      validation: (rule) => rule.custom(requiredWhenLive),
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
      validation: (rule) => rule.custom(requiredWhenLive),
      fields: [
        defineField({
          name: 'title',
          title: 'Title',
          description: 'Short manifesto phrase, e.g. "Forms that hold, not dominate"',
          type: 'string',
          validation: (rule) => rule.custom(requiredWhenLive),
        }),
        defineField({
          name: 'highlight',
          title: 'Highlight',
          description: 'Substring of the title to emphasize (may also be appended text)',
          type: 'string',
          validation: (rule) => rule.custom(requiredWhenLive),
        }),
        defineField({
          name: 'body',
          title: 'Body',
          type: 'text',
          rows: 6,
          validation: (rule) => rule.custom(requiredWhenLive),
        }),
      ],
    }),

    defineField({
      name: 'themeSection',
      title: 'Theme section',
      type: 'object',
      group: 'theme',
      validation: (rule) => rule.custom(requiredWhenLive),
      fields: [
        defineField({
          name: 'body',
          title: 'Body',
          description: 'Longer prose for the theme section. Renders as one paragraph.',
          type: 'text',
          rows: 8,
          validation: (rule) => rule.custom(requiredWhenLive),
        }),
      ],
    }),

    defineField({
      name: 'artists',
      title: 'Artists',
      type: 'array',
      group: 'artists',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'artist' }] })],
      validation: (rule) => rule.custom(requiredWhenLive).unique(),
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
      validation: (rule) => rule.custom(requiredWhenLive),
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
