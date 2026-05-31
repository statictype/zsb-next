import { CaseIcon, ImageIcon, UsersIcon } from '@sanity/icons'
import type { StructureResolver } from 'sanity/structure'
import { isSingletonType } from './lib/singleton'

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      // Editions — listed first since they're the primary content
      S.documentTypeListItem('edition').title('Editions').icon(ImageIcon),

      S.divider(),

      // People & organizations referenced from editions and press
      S.documentTypeListItem('artist').title('Artists').icon(UsersIcon),
      S.documentTypeListItem('organization').title('Organizations').icon(CaseIcon),

      // Anything else the schema adds that isn't a singleton.
      // Singletons (when they exist) are pinned above the divider by the
      // sections that introduce them, so we filter them out here to avoid
      // a duplicate "Create new" entry point.
      ...S.documentTypeListItems().filter((item) => {
        const id = item.getId()
        if (!id) return false
        if (['edition', 'artist', 'organization'].includes(id)) return false
        return !isSingletonType(id)
      }),
    ])
