import { defineField, defineType } from 'sanity'

export const transportRoute = defineType({
  name: 'transportRoute',
  title: 'Nearby stop',
  type: 'object',
  fields: [
    defineField({
      name: 'stop',
      title: 'Stop',
      description: 'Stop name as signed, e.g. "Bd. Poligrafiei"',
      type: 'string',
      validation: (rule) => rule.required().max(40),
    }),
    defineField({
      name: 'lines',
      title: 'Lines',
      description: 'Lines calling at this stop, e.g. "Bus 112, 331, 331B"',
      type: 'string',
      validation: (rule) => rule.required().max(140),
    }),
    defineField({
      name: 'walk',
      title: 'Walk',
      description: 'Walking time from the venue gate, e.g. "5 min walk"',
      type: 'string',
      validation: (rule) => rule.required().max(40),
    }),
  ],
  preview: {
    select: { title: 'stop', lines: 'lines', walk: 'walk' },
    prepare: ({ title, lines, walk }) => ({
      title,
      subtitle: [lines, walk].filter(Boolean).join(' · '),
    }),
  },
})
