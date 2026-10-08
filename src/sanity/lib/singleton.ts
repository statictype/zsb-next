import type { ListItemBuilder, StructureBuilder } from 'sanity/structure'

/**
 * Document types with exactly one instance. A name listed here is rendered as a singleton
 * in the structure tree, hidden from "Create new" (`sanity.config.ts` `newDocumentOptions`),
 * and loses delete/unpublish/duplicate (`sanity.config.ts` `document.actions`).
 * The `_id` equals the type name, so GROQ fetches by id: `*[_id == "siteSettings"][0]`.
 */
export const SINGLETON_TYPES = [
  'siteSettings',
  'homepage',
  'aboutPage',
  'partnersPage',
  'visitPage',
  'pressPage',
  'privacyPage',
  'galeriaBeller',
] as const satisfies readonly string[]

export type SingletonType = (typeof SINGLETON_TYPES)[number]

export function isSingletonType(type: string): boolean {
  return (SINGLETON_TYPES as readonly string[]).includes(type)
}

export function singletonListItem(
  S: StructureBuilder,
  type: string,
  title: string,
): ListItemBuilder {
  return S.listItem()
    .id(type)
    .title(title)
    .child(S.document().schemaType(type).documentId(type).title(title))
}
