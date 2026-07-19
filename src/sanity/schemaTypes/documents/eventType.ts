import { defineField, defineType } from 'sanity'
import { TagIcon } from '../../icons'

// A team-managed event category (Opening, Talk, Workshop, Film…). Events hold
// an array of references to these (an event can carry more than one). Stored as
// documents rather than an enum so the team can extend the list without a
// developer and the calendar filters have a canonical list to enumerate —
// ADR 0014. The `slug` is the stable key the filter URL state uses, so renaming
// the title later doesn't break a shared link.
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
