import { imageFieldWithAlt } from '@/sanity/schemaTypes/shared/imageFieldWithAlt'

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
