import type { ListItemBuilder, StructureBuilder } from 'sanity/structure'

/**
 * Document types that exist as exactly one instance in the dataset.
 * Adding a name here causes Studio to:
 *   - render the doc as a singleton in the structure tree (`singletonListItem` below)
 *   - hide it from the "Create new" menu (see `sanity.config.ts` → `document.newDocumentOptions`)
 *   - remove the `delete` / `unpublish` / `duplicate` actions (see `sanity.config.ts` → `document.actions`)
 *
 * The doc's `_id` is locked to the type name (e.g. `siteSettings` → `_id: "siteSettings"`),
 * so GROQ should fetch by id: `*[_id == "siteSettings"][0]`.
 */
export const SINGLETON_TYPES = [
  'siteSettings',
  'homepage',
  'aboutPage',
  'partnersPage',
  'visitPage',
  'pressPage',
  'privacyPage',
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
