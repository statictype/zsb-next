import { defineField } from 'sanity'

export function metaDescriptionField(options?: { group?: string; required?: boolean }) {
  const required = options?.required ?? false
  return defineField({
    name: 'metaDescription',
    title: 'Search & social description',
    description: required
      ? 'The ~155-character summary shown in search results and social previews.'
      : 'Optional. The ~155-character summary shown in search results and social previews. Leave empty to fall back to the default for this page.',
    type: 'text',
    rows: 3,
    ...(options?.group ? { group: options.group } : {}),
    validation: (rule) => {
      const lengthWarning = rule
        .max(160)
        .warning('Descriptions over ~160 characters get truncated in search results.')
      return required ? [rule.required(), lengthWarning] : lengthWarning
    },
  })
}
