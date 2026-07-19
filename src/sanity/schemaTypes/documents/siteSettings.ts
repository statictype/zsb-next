import { defineField, defineType } from 'sanity'
import { CogIcon } from '@/sanity/icons'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site settings',
  type: 'document',
  icon: CogIcon,
  fields: [
    defineField({
      name: 'heroEdition',
      title: 'Home hero — lead with',
      description:
        'Which edition the homepage hero leads with: the Latest edition (the most recent that has taken place) or the Upcoming one (the next). Falls back to Latest when there is no upcoming edition. Independent of the Visit page’s setting.',
      type: 'string',
      options: {
        list: [
          { title: 'Latest edition', value: 'latest' },
          { title: 'Upcoming edition', value: 'upcoming' },
        ],
        layout: 'radio',
      },
      initialValue: 'latest',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'visitEdition',
      title: 'Visit venues — show',
      description:
        'Which edition’s venues the Visit page lists: the Latest edition (the most recent that has taken place) or the Upcoming one (the next). Falls back to Latest when there is no upcoming edition. Independent of the home hero’s setting.',
      type: 'string',
      options: {
        list: [
          { title: 'Latest edition', value: 'latest' },
          { title: 'Upcoming edition', value: 'upcoming' },
        ],
        layout: 'radio',
      },
      initialValue: 'latest',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'contactEmail',
      title: 'Contact email',
      description:
        'Used in the footer "Contact" link, partner CTAs, and any other mailto on the site.',
      type: 'string',
      validation: (rule) => rule.required().email().error('Must be a valid email address'),
    }),
    defineField({
      name: 'instagramUrl',
      title: 'Instagram URL',
      description: 'Full URL to the ZSB Instagram profile. Leave blank to hide the link.',
      type: 'url',
      validation: (rule) => rule.uri({ scheme: ['https'] }),
    }),
    defineField({
      name: 'facebookUrl',
      title: 'Facebook URL',
      description: 'Full URL to the ZSB Facebook page. Leave blank to hide the link.',
      type: 'url',
      validation: (rule) => rule.uri({ scheme: ['https'] }),
    }),
  ],
  preview: {
    prepare: () => ({ title: 'Site settings' }),
  },
})
