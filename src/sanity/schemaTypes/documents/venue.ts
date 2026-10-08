import { defineField, defineType } from 'sanity'
import { slugify } from '@/lib/slugify'
import { apiVersion } from '@/sanity/env'
import { PinIcon } from '@/sanity/icons'

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
      name: 'slug',
      title: 'URL slug',
      description:
        'Short id used in event URLs (e.g. "cfp"). Generated from the name — shorten it to keep event links tidy. Leave blank to fall back to the full name.',
      type: 'slug',
      options: { source: 'name', slugify, maxLength: 40 },
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
        rule.custom(async (value, context) => {
          if (!value?._ref) return true
          const selfId = (context.document?._id as string | undefined)?.replace(/^drafts\./, '')
          if (selfId && value._ref === selfId) return 'A venue cannot be part of itself'
          // The roll-up ignores a parent's own `partOf`, so a two-level nest would mis-group.
          const client = context.getClient({ apiVersion })
          const parentPartOf: string | null = await client.fetch(
            'coalesce(*[_id == "drafts." + $id][0].partOf._ref, *[_id == $id][0].partOf._ref)',
            { id: value._ref },
          )
          if (parentPartOf) return 'That venue is already a sub-venue — pick a top-level venue'
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
