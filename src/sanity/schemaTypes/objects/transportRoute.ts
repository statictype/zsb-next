import { defineField, defineType } from 'sanity'

export const transportRoute = defineType({
  name: 'transportRoute',
  title: 'Transport route',
  type: 'object',
  fields: [
    defineField({
      name: 'from',
      title: 'From',
      description: 'Origin landmark, e.g. "Gara de Nord"',
      type: 'string',
      validation: (rule) => rule.required().max(40),
    }),
    defineField({
      name: 'lines',
      title: 'Lines',
      description: 'Transit options, e.g. "Bus 205 / Tram 45"',
      type: 'string',
      validation: (rule) => rule.required().max(60),
    }),
    defineField({
      name: 'walk',
      title: 'Walk',
      description: 'Walking time from the stop, e.g. "5 min walk"',
      type: 'string',
      validation: (rule) => rule.required().max(40),
    }),
  ],
  preview: {
    select: { title: 'from', lines: 'lines', walk: 'walk' },
    prepare: ({ title, lines, walk }) => ({
      title,
      subtitle: [lines, walk].filter(Boolean).join(' · '),
    }),
  },
})
