import { defineArrayMember, defineField, defineType } from 'sanity'
import { apiVersion } from '@/sanity/env'
import { CubeIcon } from '@/sanity/icons'
import { lockedOncePublished } from '@/sanity/schemaTypes/shared/lockedOncePublished'

export const work = defineType({
  name: 'work',
  title: 'Work',
  type: 'document',
  icon: CubeIcon,
  fields: [
    defineField({
      name: 'edition',
      title: 'Edition',
      description: 'The ZSB edition that showed this work. Leave empty for Galeria Beller works.',
      type: 'reference',
      to: [{ type: 'edition' }],
    }),
    defineField({
      name: 'key',
      title: 'Number',
      description: 'Galeria Beller map number. It cannot change after publishing.',
      type: 'number',
      hidden: ({ document, value }) => value === undefined && Boolean(document?.['edition']),
      validation: (rule) =>
        rule
          .integer()
          .min(1)
          .custom((key, context) =>
            key === undefined && !context.document?.['edition']
              ? 'Required when the work has no edition'
              : true,
          )
          .custom(async (key, context) => {
            if (key === undefined) return true
            const id = context.document?._id.replace(/^drafts\./, '') ?? ''
            const taken: number = await context
              .getClient({ apiVersion })
              .fetch(
                'count(*[_type == "work" && key == $key && !(_id in [$id, "drafts." + $id])])',
                { key, id },
              )
            return taken === 0 ? true : `Number ${key} is already used by another work`
          })
          .custom(lockedOncePublished('key')),
    }),
    defineField({
      name: 'artist',
      title: 'Artist',
      type: 'reference',
      to: [{ type: 'artist' }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'collaborators',
      title: 'Collaborators',
      description: 'Other artists credited on a joint work.',
      type: 'array',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'artist' }] })],
      validation: (rule) => rule.unique(),
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'localeString',
      validation: (rule) =>
        rule.custom((value: { ro?: string; en?: string } | undefined) =>
          value?.ro?.trim() && value.en?.trim() ? true : 'Both languages are required',
        ),
    }),
    defineField({
      name: 'material',
      title: 'Material',
      type: 'localeString',
    }),
    defineField({
      name: 'dimensions',
      title: 'Dimensions',
      description: 'e.g. 230 × 230 × 220 cm',
      type: 'string',
    }),
    defineField({
      name: 'year',
      title: 'Year',
      description: 'e.g. 2024 or 2017–2026',
      type: 'string',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'localeBlock',
    }),
    defineField({
      name: 'images',
      title: 'Images',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'image',
          options: { hotspot: true },
          fields: [
            defineField({
              name: 'alt',
              title: 'Alt text',
              type: 'string',
              validation: (rule) =>
                rule.custom((alt, context) => {
                  const hasImage = Boolean(
                    (context.parent as { asset?: unknown } | undefined)?.asset,
                  )
                  if (hasImage && !alt) return 'Alt text is required when an image is set'
                  return true
                }),
            }),
            defineField({
              name: 'credit',
              title: 'Credit',
              description: 'Photographer, e.g. "Photo: Roald Aron".',
              type: 'string',
            }),
          ],
        }),
      ],
      validation: (rule) => rule.min(1).warning('The artist page shows no image for this work'),
    }),
  ],
  orderings: [
    { title: 'Number', name: 'keyAsc', by: [{ field: 'key', direction: 'asc' }] },
    {
      title: 'Edition',
      name: 'editionDesc',
      by: [
        { field: 'edition.year', direction: 'desc' },
        { field: 'key', direction: 'asc' },
      ],
    },
  ],
  preview: {
    select: {
      key: 'key',
      year: 'edition.year',
      title: 'title.en',
      artist: 'artist.name',
      media: 'images.0',
    },
    prepare({ key, year, title, artist, media }) {
      const prefix = year ? `${year} ·` : `${key ?? '?'}.`
      return { title: `${prefix} ${title ?? 'Untitled'}`, subtitle: artist, media }
    },
  },
})
