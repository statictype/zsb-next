import { defineArrayMember, defineField, defineType } from 'sanity'
import { HomeIcon } from '@/sanity/icons'
import { metaDescriptionField } from '@/sanity/schemaTypes/shared/metaDescriptionField'
import { ogImageField } from '@/sanity/schemaTypes/shared/ogImageField'
import { isSubstringOf } from '@/sanity/schemaTypes/shared/substringValidator'

export const homepage = defineType({
  name: 'homepage',
  title: 'Homepage',
  type: 'document',
  icon: HomeIcon,
  groups: [
    { name: 'hero', title: 'Hero', default: true },
    { name: 'editions', title: 'Editions section' },
    { name: 'social', title: 'Social' },
  ],
  fields: [
    defineField({
      name: 'heroTitle',
      title: 'Hero title',
      description:
        'The big brand mark above the lead. Usually the event name. The renderer breaks before the accented portion and renders it on a new line.',
      type: 'string',
      group: 'hero',
      validation: (rule) => rule.required().max(80),
    }),
    defineField({
      name: 'heroTitleAccent',
      title: 'Hero title — accented portion',
      description:
        'A substring of the hero title that gets the accent color and drops to a new line. e.g. "Sculpture Days" inside "Bucharest Sculpture Days".',
      type: 'string',
      group: 'hero',
      validation: (rule) => rule.required().custom(isSubstringOf('heroTitle', 'hero title')),
    }),
    defineField({
      name: 'heroLead',
      title: 'Hero lead',
      description: 'One short paragraph under the title.',
      type: 'text',
      rows: 3,
      group: 'hero',
      validation: (rule) => rule.required().max(220),
    }),
    defineField({
      name: 'heroCtaLabel',
      title: 'CTA label',
      description: 'Text on the hero button. Leave empty (with no target) to hide the button.',
      type: 'string',
      group: 'hero',
    }),
    defineField({
      name: 'heroCtaEdition',
      title: 'CTA target — edition',
      description: 'Which edition the CTA links to. Usually the most recent live one.',
      type: 'reference',
      to: [{ type: 'edition' }],
      group: 'hero',
      // Only live editions have a reachable page; an upcoming edition's route
      // is a hard 404, so the picker is filtered to live editions to keep the
      // hero button from ever linking to a dead page.
      options: { filter: 'status == "live"' },
      validation: (rule) =>
        rule.custom((value, context) => {
          const label = (context.parent as { heroCtaLabel?: string } | undefined)?.heroCtaLabel
          if (label && !value) return 'Set a target edition when a CTA label is filled in'
          if (!label && value) return 'Set a CTA label when a target edition is picked'
          return true
        }),
    }),
    defineField({
      name: 'slideshow',
      title: 'Hero slideshow',
      description:
        'Photos that cycle behind the title. Pick a crop position for each so the subject stays framed across screen sizes.',
      type: 'array',
      group: 'hero',
      of: [defineArrayMember({ type: 'heroSlide' })],
      validation: (rule) => rule.required().min(1).max(12),
    }),
    defineField({
      name: 'editionsIntro',
      title: 'Editions section intro',
      description:
        'Short paragraph under the EDITIONS heading on the homepage. The list of editions itself is derived automatically from published edition documents.',
      type: 'text',
      rows: 3,
      group: 'editions',
      validation: (rule) => rule.required().max(280),
    }),
    ogImageField({ group: 'social' }),
    metaDescriptionField({ group: 'social', required: true }),
  ],
  preview: { prepare: () => ({ title: 'Homepage' }) },
})
