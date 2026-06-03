import { CalendarIcon } from '@sanity/icons'
import { defineArrayMember, defineField, defineType } from 'sanity'
import { imageFieldWithAlt } from '../shared/imageFieldWithAlt'
import { isSubstringOf } from '../shared/substringValidator'

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
      validation: (rule) => rule.custom(requiredWhenLive).custom(isSubstringOf('theme', 'theme')),
    }),
    defineField({
      name: 'title',
      title: 'Page title',
      description: 'Browser tab / SEO title',
      type: 'string',
      group: 'hero',
      validation: (rule) => rule.custom(requiredWhenLive),
    }),
    // Legacy free-text date tape. Kept (optional) during the dateTape-typing
    // migration so live editions still validate before their dateStart/dateEnd/
    // venueLine are backfilled. Removed in the contract phase. The runtime
    // composes the hero string from the typed fields below when they're set,
    // falling back to this. See docs/cms-rollout-plan.md Step 6.
    defineField({
      name: 'dateTape',
      title: 'Date tape (legacy)',
      description: 'Being replaced by Start date / End date / Venue line. Leave as-is.',
      type: 'string',
      group: 'hero',
      readOnly: true,
    }),
    // dateStart / dateEnd / venueLine are optional during the expand phase so
    // the not-yet-migrated live editions still validate. They become
    // required-when-live in the contract phase once the migration has filled
    // them. See docs/cms-rollout-plan.md Step 6.
    defineField({
      name: 'dateStart',
      title: 'Start date',
      type: 'date',
      group: 'hero',
      options: { dateFormat: 'DD MMMM YYYY' },
    }),
    defineField({
      name: 'dateEnd',
      title: 'End date',
      type: 'date',
      group: 'hero',
      options: { dateFormat: 'DD MMMM YYYY' },
      validation: (rule) =>
        rule.custom((end, context) => {
          const start = (context.parent as { dateStart?: string } | undefined)?.dateStart
          if (typeof end === 'string' && typeof start === 'string' && end < start) {
            return 'End date must be on or after the start date'
          }
          return true
        }),
    }),
    defineField({
      name: 'venueLine',
      title: 'Venue line',
      description: 'Venue shown after the dates, e.g. "Combinatul Fondului Plastic"',
      type: 'string',
      group: 'hero',
    }),
    // Alt is required whenever an image is actually uploaded, regardless of edition status.
    imageFieldWithAlt({
      name: 'heroImage',
      title: 'Hero image',
      group: 'hero',
      altNoun: 'a hero image',
      validation: (rule) => rule.custom(requiredWhenLive),
    }),
    imageFieldWithAlt({
      name: 'thumbImage',
      title: 'Thumbnail image',
      description: 'Optional. Used on the home page / edition cards. Falls back to hero image.',
      group: 'hero',
      altNoun: 'a thumbnail',
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
      // Expand phase: accept the unified `carouselSlide` and the five legacy
      // slide types side by side so existing items validate while the
      // migration runs. The legacy members are dropped in the contract phase.
      of: [
        defineArrayMember({ type: 'carouselSlide' }),
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
        imageFieldWithAlt({
          name: 'poster',
          title: 'Official poster',
          description: 'The key visual for this edition.',
          altNoun: 'a poster',
        }),
        imageFieldWithAlt({
          name: 'coverPhoto',
          title: 'Cover photo',
          description: 'A representative photograph from the exhibition.',
          altNoun: 'a cover photo',
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
