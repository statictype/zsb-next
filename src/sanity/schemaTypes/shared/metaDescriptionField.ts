import { defineField } from 'sanity'

/**
 * Optional per-document meta description (the `<meta name="description">` /
 * `og:description` summary shown in search results and social previews). When
 * set it overrides the page's hardcoded default; when empty the frontend falls
 * back to that default (or, for editions, the truncated manifesto). Pass
 * `group` to slot it into a document's field groups.
 */
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
    // Two rules at different severities: presence is a hard error (when
    // required), while the length cap is a soft warning — Google truncates
    // around 160 characters but an editor may have a reason to run long.
    validation: (rule) => {
      const lengthWarning = rule
        .max(160)
        .warning('Descriptions over ~160 characters get truncated in search results.')
      return required ? [rule.required(), lengthWarning] : lengthWarning
    },
  })
}
