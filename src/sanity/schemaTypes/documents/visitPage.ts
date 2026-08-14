import { defineArrayMember, defineField, defineType } from 'sanity'
import { PinIcon } from '@/sanity/icons'
import { imageFieldWithAlt } from '@/sanity/schemaTypes/shared/imageFieldWithAlt'
import { metaDescriptionField } from '@/sanity/schemaTypes/shared/metaDescriptionField'
import { ogImageField } from '@/sanity/schemaTypes/shared/ogImageField'

export const visitPage = defineType({
  name: 'visitPage',
  title: 'Visit',
  type: 'document',
  icon: PinIcon,
  groups: [
    { name: 'venue', title: 'Venue', default: true },
    { name: 'practical', title: 'Practical' },
    { name: 'faq', title: 'FAQ' },
    { name: 'social', title: 'Social' },
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
      title: 'Nearest stops',
      description: 'Public transport stops within walking distance, nearest first.',
      type: 'array',
      group: 'practical',
      of: [defineArrayMember({ type: 'transportRoute' })],
      validation: (rule) => rule.required().min(1).max(8),
    }),
    defineField({
      name: 'faq',
      title: 'Frequently asked questions',
      description:
        'Optional. Every entry appears on the page and in its FAQ structured data. The address, opening hours and nearest stops are already shown above — add only what they can’t cover, such as tickets, accessibility or the year-round venue.',
      type: 'array',
      group: 'faq',
      of: [defineArrayMember({ type: 'faqItem' })],
      validation: (rule) => rule.max(12),
    }),
    ogImageField({ group: 'social' }),
    metaDescriptionField({ group: 'social', required: true }),
  ],
  preview: { prepare: () => ({ title: 'Visit' }) },
})
