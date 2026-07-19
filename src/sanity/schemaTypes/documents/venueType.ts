import { defineField, defineType } from 'sanity'
import { TagsIcon } from '../../icons'

// A team-managed venue category (partner venue, partner gallery, artist
// studio…). A venue holds one reference to these. Same taxonomy-as-documents
// rationale as `eventType` — ADR 0014: editor-managed, referential integrity,
// a canonical list for the venues view to group by.
export const venueType = defineType({
  name: 'venueType',
  title: 'Venue type',
  type: 'document',
  icon: TagsIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      description: 'e.g. "Partner venue", "Partner gallery", "Artist studio".',
      type: 'string',
      validation: (rule) => rule.required().min(1).max(60),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      description: 'Stable key used in the calendar filter URL. Auto-filled from the title.',
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
