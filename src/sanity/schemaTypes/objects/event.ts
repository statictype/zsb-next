import { CalendarIcon } from '@sanity/icons'
import { defineArrayMember, defineField, defineType } from 'sanity'
import { slugify } from '../../../lib/slugify'
import { imageFieldWithAlt } from '../shared/imageFieldWithAlt'

// The building block of the program. Events are nested in the edition (one list
// per edition), not standalone documents — an event has no life outside its
// edition and we don't deep-link a single one; sharing targets the filtered
// calendar view (ADR 0014). Timing is a Bucharest-local `startDate` + optional
// `startTime` (only when the time matters) + optional `endDate`; we store no UTC
// instants and no end-times. "Ongoing" (multi-day) and "past vs upcoming" are
// *derived* by the renderer, never stored here.
export const event = defineType({
  name: 'event',
  title: 'Event',
  type: 'object',
  icon: CalendarIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (rule) => rule.required().min(1).max(200),
    }),
    defineField({
      name: 'startDate',
      title: 'Start date',
      type: 'date',
      options: { dateFormat: 'DD MMMM YYYY' },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'startTime',
      title: 'Start time',
      description:
        'Optional. Local (Bucharest) time, only when it matters — an 18:00 opening. Format HH:mm. Leave empty for all-day / multi-day events.',
      type: 'string',
      validation: (rule) =>
        rule
          .regex(/^([01]\d|2[0-3]):[0-5]\d$/, { name: 'time (HH:mm)' })
          .error('Use 24-hour HH:mm, e.g. 18:00'),
    }),
    defineField({
      name: 'endDate',
      title: 'End date',
      description:
        'Optional. For an exhibition that runs over several days. An event whose end date is on a later day than its start is shown as a multi-day "Ongoing" run, with its own date range.',
      type: 'date',
      options: { dateFormat: 'DD MMMM YYYY' },
      validation: (rule) =>
        rule.custom((end, context) => {
          const start = (context.parent as { startDate?: string } | undefined)?.startDate
          if (typeof end === 'string' && typeof start === 'string' && end < start) {
            return 'End date must be on or after the start date'
          }
          return true
        }),
    }),
    defineField({
      name: 'types',
      title: 'Type(s)',
      description:
        'One or more, picked from the team-managed Event types list. The event shows under each.',
      type: 'array',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'eventType' }] })],
      validation: (rule) => rule.required().min(1).unique(),
    }),
    defineField({
      name: 'venue',
      title: 'Venue',
      description: 'Required. The most specific place it happens (the studio, not just "CFP").',
      type: 'reference',
      to: [{ type: 'venue' }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Short description',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.required().min(1),
    }),
    imageFieldWithAlt({
      name: 'image',
      title: 'Image / poster',
      description: 'Optional.',
      altNoun: 'an event image',
    }),
    defineField({
      name: 'facebookUrl',
      title: 'Facebook link',
      type: 'url',
      validation: (rule) => rule.uri({ scheme: ['https'] }),
    }),
    defineField({
      name: 'ticketUrl',
      title: 'Ticket / registration link',
      type: 'url',
      validation: (rule) => rule.uri({ scheme: ['https'] }),
    }),
    defineField({
      name: 'featured',
      title: 'Featured on homepage',
      description: 'Mark a few must-see events to surface them on the homepage.',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'slug',
      title: 'Custom URL slug',
      description:
        'Optional. Overrides the auto-generated event link (date · venue · name). Leave empty to auto-generate.',
      type: 'slug',
      options: { source: 'name', slugify, maxLength: 80 },
    }),
  ],
  preview: {
    select: {
      title: 'name',
      startDate: 'startDate',
      startTime: 'startTime',
      venueName: 'venue.name',
      media: 'image',
    },
    prepare({ title, startDate, startTime, venueName, media }) {
      const when = [startDate, startTime].filter(Boolean).join(' ')
      const subtitle = [when, venueName].filter(Boolean).join(' · ')
      return { title, ...(subtitle ? { subtitle } : {}), ...(media ? { media } : {}) }
    },
  },
})
