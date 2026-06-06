import { PinIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

// A place, saved once and reused across editions (its own document, not retyped
// per edition) — ADR 0014. Events reference the *most specific* venue they
// happen in; the `partOf` self-reference lets the views roll sub-venues up
// under their parent (a studio inside CFP). Deliberately lean: no hours /
// amenities / transport here — those stay on the Visit page's main-venue block
// (ZSB-26). "What's on here" is not typed on the venue; it's simply the events
// that point to it.
export const venue = defineType({
  name: 'venue',
  title: 'Venue',
  type: 'document',
  icon: PinIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (rule) => rule.required().min(1).max(120),
    }),
    defineField({
      name: 'type',
      title: 'Type',
      description: 'Picked from the team-managed Venue types list.',
      type: 'reference',
      to: [{ type: 'venueType' }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'partOf',
      title: 'Part of',
      description:
        'Optional. A parent venue, for a place inside a bigger place (a studio inside CFP). Leave empty for a top-level venue.',
      type: 'reference',
      to: [{ type: 'venue' }],
      validation: (rule) =>
        rule.custom((value, context) => {
          if (!value?._ref) return true
          const selfId = (context.document?._id as string | undefined)?.replace(/^drafts\./, '')
          if (selfId && value._ref === selfId) return 'A venue cannot be part of itself'
          return true
        }),
    }),
    defineField({
      name: 'address',
      title: 'Address',
      type: 'string',
    }),
    defineField({
      name: 'mapUrl',
      title: 'Google Maps link',
      type: 'url',
      validation: (rule) => rule.uri({ scheme: ['https'] }),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
    }),
  ],
  orderings: [{ title: 'Name, A–Z', name: 'nameAsc', by: [{ field: 'name', direction: 'asc' }] }],
  preview: {
    select: { title: 'name', typeTitle: 'type.title', parentName: 'partOf.name' },
    prepare({ title, typeTitle, parentName }) {
      const subtitle = [parentName && `in ${parentName}`, typeTitle].filter(Boolean).join(' · ')
      return { title, ...(subtitle ? { subtitle } : {}) }
    },
  },
})
