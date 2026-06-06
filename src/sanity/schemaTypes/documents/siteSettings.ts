import { CogIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site settings',
  type: 'document',
  icon: CogIcon,
  fields: [
    defineField({
      name: 'currentEdition',
      title: 'Current edition',
      description:
        'The edition the site is showing right now. Drives the homepage featured events and the Visit-page venues list. Flip this once the new edition is ready to take over — past editions stay online either way.',
      type: 'reference',
      to: [{ type: 'edition' }],
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
