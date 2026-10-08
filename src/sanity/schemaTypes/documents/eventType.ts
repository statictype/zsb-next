import { defineField, defineType } from 'sanity'
import { TagIcon } from '@/sanity/icons'

export const eventType = defineType({
  name: 'eventType',
  title: 'Event type',
  type: 'document',
  icon: TagIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      description: 'Shown on the filter chips, e.g. "Opening", "Talk", "Workshop", "Film".',
      type: 'string',
      validation: (rule) => rule.required().min(1).max(60),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      description: 'Stable key used in the program filter URL. Auto-filled from the title.',
      type: 'slug',
      options: { source: 'title', maxLength: 60 },
      validation: (rule) => rule.required(),
    }),
  ],
  orderings: [
    { title: 'Title, A–Z', name: 'titleAsc', by: [{ field: 'title', direction: 'asc' }] },
  ],
  preview: {
    select: { title: 'title' },
  },
})
