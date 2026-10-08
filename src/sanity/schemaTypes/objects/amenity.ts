import { defineField, defineType } from 'sanity'

/** The icon key selects the Remix icon; the mapping lives in VisitSection. */
const AMENITY_ICONS = [
  { title: 'Wheelchair access', value: 'wheelchair' },
  { title: 'Parking', value: 'parking' },
  { title: 'Café', value: 'cafe' },
  { title: 'Kids workshops', value: 'paint' },
] as const

export const amenity = defineType({
  name: 'amenity',
  title: 'Amenity',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      validation: (rule) => rule.required().max(40),
    }),
    defineField({
      name: 'icon',
      title: 'Icon',
      type: 'string',
      options: { list: [...AMENITY_ICONS] },
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { title: 'label', subtitle: 'icon' },
    prepare: ({ title, subtitle }) => ({
      title,
      ...(subtitle ? { subtitle: `Icon: ${subtitle}` } : {}),
    }),
  },
})
