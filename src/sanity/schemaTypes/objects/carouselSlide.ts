import { defineArrayMember, defineField, defineType } from 'sanity'

const carouselImageMember = defineArrayMember({
  type: 'object',
  name: 'carouselImage',
  title: 'Image',
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
      name: 'caption',
      title: 'Caption',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { title: 'caption', media: 'image' },
  },
})

function slideType({
  name,
  title,
  count,
}: {
  name: string
  title: string
  count: 1 | 2 | 3
}) {
  return defineType({
    name,
    title,
    type: 'object',
    fields: [
      defineField({
        name: 'images',
        title: 'Images',
        type: 'array',
        of: [carouselImageMember],
        validation: (rule) =>
          rule
            .required()
            .length(count)
            .error(`This layout requires exactly ${count} image${count === 1 ? '' : 's'}`),
      }),
    ],
    preview: {
      select: { media: 'images.0.image' },
      prepare({ media }) {
        return { title, subtitle: `${count} image${count === 1 ? '' : 's'}`, media }
      },
    },
  })
}

export const slideFull = slideType({ name: 'slideFull', title: 'Full slide', count: 1 })
export const slideDuo = slideType({ name: 'slideDuo', title: 'Duo slide', count: 2 })
export const slideFeaturedPortrait = slideType({
  name: 'slideFeaturedPortrait',
  title: 'Featured portrait slide',
  count: 2,
})
export const slideTrio = slideType({ name: 'slideTrio', title: 'Trio slide', count: 3 })
export const slideFeaturedStack = slideType({
  name: 'slideFeaturedStack',
  title: 'Featured stack slide',
  count: 3,
})
