import { LockIcon } from '@sanity/icons'
import { defineArrayMember, defineField, defineType } from 'sanity'
import { ogImageField } from '../shared/ogImageField'

export const privacyPage = defineType({
  name: 'privacyPage',
  title: 'Privacy',
  type: 'document',
  icon: LockIcon,
  fields: [
    defineField({
      name: 'hero',
      title: 'Hero',
      type: 'pageHero',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'body',
      title: 'Body',
      description:
        'Long-form legal text. Supports headings, bold, italics, links, and lists. The "Change your mind" cookie-settings button is rendered automatically below the body — no need to include it here.',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'block',
          // Privacy is the ONE place in this project that uses Portable
          // Text — see ADR 0007. Keep the surface narrow: H2 for
          // sections, body for paragraphs, the standard marks.
          styles: [
            { title: 'Body', value: 'normal' },
            { title: 'Section heading (H2)', value: 'h2' },
          ],
          lists: [
            { title: 'Bullet list', value: 'bullet' },
            { title: 'Numbered list', value: 'number' },
          ],
          marks: {
            decorators: [
              { title: 'Bold', value: 'strong' },
              { title: 'Italic', value: 'em' },
            ],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'Link',
                fields: [
                  defineField({
                    name: 'href',
                    title: 'URL',
                    type: 'url',
                    validation: (rule) =>
                      rule
                        .required()
                        .uri({ scheme: ['https', 'http', 'mailto'], allowRelative: true }),
                  }),
                  defineField({
                    name: 'newTab',
                    title: 'Open in new tab',
                    type: 'boolean',
                    initialValue: false,
                  }),
                ],
              },
            ],
          },
        }),
      ],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: 'updatedAt',
      title: 'Last updated',
      type: 'date',
      validation: (rule) => rule.required(),
    }),
    ogImageField(),
  ],
  preview: { prepare: () => ({ title: 'Privacy' }) },
})
