import { defineField, defineType } from 'sanity'
import { ImageIcon } from '@/sanity/icons'
import { imageFieldWithAlt } from '@/sanity/schemaTypes/shared/imageFieldWithAlt'

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
    imageFieldWithAlt({
      name: 'image',
      title: 'Image',
      altDescription: 'Describe the photo for screen readers and SEO.',
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
