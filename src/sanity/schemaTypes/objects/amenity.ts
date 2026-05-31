import { defineField, defineType } from 'sanity'

/**
 * Visit-page amenity. The icon key drives which Remix icon the
 * renderer picks (mapping lives in VisitSection). Keeping the icon
 * set fixed prevents editors from picking icons we can't render.
 */
const AMENITY_ICONS = [
  { title: 'Wheelchair access', value: 'wheelchair' },
  { title: 'Parking', value: 'parking' },
  { title: 'Café', value: 'cafe' },
  { title: 'Kids workshops', value: 'paint' },
  { title: 'Restroom', value: 'restroom' },
  { title: 'Wi-Fi', value: 'wifi' },
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
