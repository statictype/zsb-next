import { defineField, defineType } from 'sanity'

export const venueEntry = defineType({
  name: 'venueEntry',
  title: 'Venue',
  type: 'object',
  fields: [
    defineField({
      name: 'group',
      title: 'Group',
      description: 'Top-level grouping label, e.g. "Combinatul Fondului Plastic"',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'subgroup',
      title: 'Subgroup',
      description: 'e.g. "Main Exhibition", "Open Doors", "Solo Exhibition"',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'name',
      title: 'Name',
      description: 'Venue or gallery name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'program',
      title: 'Program',
      description: 'What is shown at this venue, e.g. "#SYZYGY", "Open Studios"',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { title: 'name', group: 'group', subgroup: 'subgroup' },
    prepare({ title, group, subgroup }) {
      return { title, subtitle: [group, subgroup].filter(Boolean).join(' · ') }
    },
  },
})
