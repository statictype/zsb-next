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

function slideType({ name, title, count }: { name: string; title: string; count: 1 | 2 | 3 }) {
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

// --- Legacy: five per-layout slide types ---------------------------------
// Kept registered during the carousel-collapse migration (expand phase) so
// existing `edition.carousel[]` items still validate while data is migrated
// to the unified `carouselSlide` below. Removed in the contract phase once
// the migration has run. See docs/cms-rollout-plan.md Step 6.
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

// --- Unified slide type (ADR 0010) ----------------------------------------
// One object, a `layout` enum, and a length-validated `images` array whose
// required count is derived from the chosen layout. Replaces the five types
// above after the migration.
const CAROUSEL_LAYOUTS = [
  { title: 'Full (1 image)', value: 'full', count: 1 },
  { title: 'Duo (2 images)', value: 'duo', count: 2 },
  { title: 'Featured portrait (2 images)', value: 'featured-portrait', count: 2 },
  { title: 'Trio (3 images)', value: 'trio', count: 3 },
  { title: 'Featured stack (3 images)', value: 'featured-stack', count: 3 },
] as const

const LAYOUT_COUNT: Record<string, number> = Object.fromEntries(
  CAROUSEL_LAYOUTS.map((l) => [l.value, l.count]),
)

export const carouselSlide = defineType({
  name: 'carouselSlide',
  title: 'Carousel slide',
  type: 'object',
  fields: [
    defineField({
      name: 'layout',
      title: 'Layout',
      type: 'string',
      options: { list: CAROUSEL_LAYOUTS.map(({ title, value }) => ({ title, value })) },
      initialValue: 'full',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'images',
      title: 'Images',
      type: 'array',
      of: [carouselImageMember],
      validation: (rule) =>
        rule.custom((images, context) => {
          const layout = (context.parent as { layout?: string } | undefined)?.layout
          const required = layout ? LAYOUT_COUNT[layout] : undefined
          if (required === undefined) return 'Choose a layout first'
          const len = Array.isArray(images) ? images.length : 0
          return len === required
            ? true
            : `The "${layout}" layout requires exactly ${required} image${required === 1 ? '' : 's'}`
        }),
    }),
  ],
  preview: {
    select: { layout: 'layout', media: 'images.0.image' },
    prepare({ layout, media }) {
      const def = CAROUSEL_LAYOUTS.find((l) => l.value === layout)
      return {
        title: def?.title ?? 'Carousel slide',
        subtitle: def ? `${def.count} image${def.count === 1 ? '' : 's'}` : '',
        media,
      }
    },
  },
})
