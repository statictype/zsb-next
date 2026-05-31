import {
  CaseIcon,
  CogIcon,
  HeartIcon,
  HomeIcon,
  ImageIcon,
  InfoOutlineIcon,
  PinIcon,
  UsersIcon,
} from '@sanity/icons'
import type { StructureResolver } from 'sanity/structure'
import { isSingletonType, singletonListItem } from './lib/singleton'

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      // Singletons — pinned at top
      singletonListItem(S, 'siteSettings', 'Site settings').icon(CogIcon),
      singletonListItem(S, 'homepage', 'Homepage').icon(HomeIcon),
      singletonListItem(S, 'aboutPage', 'About').icon(InfoOutlineIcon),
      singletonListItem(S, 'partnersPage', 'Partners').icon(HeartIcon),
      singletonListItem(S, 'visitPage', 'Visit').icon(PinIcon),

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
