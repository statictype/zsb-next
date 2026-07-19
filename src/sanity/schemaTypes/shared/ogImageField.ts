import { imageFieldWithAlt } from '@/sanity/schemaTypes/shared/imageFieldWithAlt'

/**
 * Optional per-document social share image (Open Graph / Twitter). When set it
 * overrides the generated default card; when empty the frontend falls back to
 * the branded card (static pages) or the hero overlay (editions). Pass `group`
 * to slot it into a document's field groups.
 */
export function ogImageField(options?: { group?: string }) {
  return imageFieldWithAlt({
    name: 'ogImage',
    title: 'Custom share image',
    description:
      'Optional. Shown when this page is shared on social media. 1200×630 recommended. Leave empty to use the default branded card.',
    altNoun: 'a share image',
    ...(options?.group ? { group: options.group } : {}),
  })
}
