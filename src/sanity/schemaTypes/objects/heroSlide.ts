import { ImageIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

const POSITIONS = [
  { title: 'Top', value: 'top' },
  { title: 'Center', value: 'center' },
  { title: 'Bottom', value: 'bottom' },
] as const

export const heroSlide = defineType({
  name: 'heroSlide',
  title: 'Hero slide',
  type: 'object',
  icon: ImageIcon,
  fields: [
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt text',
          description: 'Describe the photo for screen readers and SEO.',
          type: 'string',
          validation: (rule) =>
            rule.custom((alt, context) => {
              const hasImage = Boolean((context.parent as { asset?: unknown } | undefined)?.asset)
              if (hasImage && !alt) return 'Alt text is required when an image is set'
              return true
            }),
        }),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'position',
      title: 'Crop position',
      description:
        'Which part of the image stays in view when the slot is taller or narrower than the photo. Pick what keeps the subject framed.',
      type: 'string',
      options: { list: [...POSITIONS], layout: 'radio' },
      initialValue: 'center',
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { media: 'image', alt: 'image.alt', position: 'position' },
    prepare: ({ media, alt, position }) => ({
      title: alt ?? 'Hero slide',
      ...(position ? { subtitle: `Crop: ${position}` } : {}),
      media,
    }),
  },
})
