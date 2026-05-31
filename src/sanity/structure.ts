import { CaseIcon, CogIcon, HomeIcon, ImageIcon, UsersIcon } from '@sanity/icons'
import type { StructureResolver } from 'sanity/structure'
import { isSingletonType, singletonListItem } from './lib/singleton'

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      // Singletons — small set of one-of-a-kind documents pinned at top
      singletonListItem(S, 'siteSettings', 'Site settings').icon(CogIcon),
      singletonListItem(S, 'homepage', 'Homepage').icon(HomeIcon),

      S.divider(),

      // Editions — primary content
      S.documentTypeListItem('edition').title('Editions').icon(ImageIcon),

      S.divider(),

      // People & organizations referenced from editions and press
      S.documentTypeListItem('artist').title('Artists').icon(UsersIcon),
      S.documentTypeListItem('organization').title('Organizations').icon(CaseIcon),

      // Anything else the schema adds that isn't a singleton — singletons
      // are pinned above the dividers, so we filter them out to avoid
      // a duplicate entry.
      ...S.documentTypeListItems().filter((item) => {
        const id = item.getId()
        if (!id) return false
        if (['edition', 'artist', 'organization'].includes(id)) return false
        return !isSingletonType(id)
      }),
    ])
