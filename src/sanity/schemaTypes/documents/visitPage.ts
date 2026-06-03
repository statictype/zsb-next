import { PinIcon } from '@sanity/icons'
import { defineArrayMember, defineField, defineType } from 'sanity'
import { imageFieldWithAlt } from '../shared/imageFieldWithAlt'

export const visitPage = defineType({
  name: 'visitPage',
  title: 'Visit',
  type: 'document',
  icon: PinIcon,
  groups: [
    { name: 'venue', title: 'Venue', default: true },
    { name: 'practical', title: 'Practical' },
  ],
  fields: [
    defineField({
      name: 'venueName',
      title: 'Venue name',
      description:
        'Each entry renders on its own line. e.g. "COMBINATUL" / "FONDULUI" / "PLASTIC" is three lines.',
      type: 'array',
      group: 'venue',
      of: [defineArrayMember({ type: 'string' })],
      validation: (rule) => rule.required().min(1).max(5),
    }),
    defineField({
      name: 'street',
      title: 'Street address',
      description: 'e.g. "Str. Băiculești 29"',
      type: 'string',
      group: 'venue',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'city',
      title: 'City',
      description: 'e.g. "Sector 1, București"',
      type: 'string',
      group: 'venue',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'mapsUrl',
      title: 'Maps URL',
      description: 'Google Maps / Apple Maps link for "Get directions".',
      type: 'url',
      group: 'venue',
      validation: (rule) => rule.required().uri({ scheme: ['https', 'http'] }),
    }),
    imageFieldWithAlt({
      name: 'image',
      title: 'Venue image',
      group: 'venue',
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: 'hoursLines',
      title: 'Opening hours',
      description: 'Each entry renders on its own line. e.g. "Daily 11:00 — 20:00" / "Free Entry".',
      type: 'array',
      group: 'practical',
      of: [defineArrayMember({ type: 'string' })],
      validation: (rule) => rule.required().min(1).max(4),
    }),
    defineField({
      name: 'amenities',
      title: 'Amenities',
      description: 'Small badges in the practical strip.',
      type: 'array',
      group: 'practical',
      of: [defineArrayMember({ type: 'amenity' })],
      validation: (rule) => rule.required().min(1).max(8),
    }),
    defineField({
      name: 'transport',
      title: 'Transport routes',
      description: 'How to get here from major landmarks.',
      type: 'array',
      group: 'practical',
      of: [defineArrayMember({ type: 'transportRoute' })],
      validation: (rule) => rule.required().min(1).max(8),
    }),
  ],
  preview: { prepare: () => ({ title: 'Visit' }) },
})
