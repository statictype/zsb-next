import { defineArrayMember, defineField, defineType } from 'sanity'

export const localeString = defineType({
  name: 'localeString',
  title: 'Localized string',
  type: 'object',
  fields: [
    defineField({ name: 'ro', title: 'Română', type: 'string' }),
    defineField({ name: 'en', title: 'English', type: 'string' }),
  ],
})

export const localeBlock = defineType({
  name: 'localeBlock',
  title: 'Localized rich text',
  type: 'object',
  fields: [
    defineField({
      name: 'ro',
      title: 'Română',
      type: 'array',
      of: [defineArrayMember({ type: 'block' })],
    }),
    defineField({
      name: 'en',
      title: 'English',
      type: 'array',
      of: [defineArrayMember({ type: 'block' })],
    }),
  ],
})
