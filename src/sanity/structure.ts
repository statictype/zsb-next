import {
  CaseIcon,
  CogIcon,
  DocumentsIcon,
  HeartIcon,
  HomeIcon,
  ImageIcon,
  InfoOutlineIcon,
  LinkIcon,
  LockIcon,
  PinIcon,
  TransferIcon,
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
      singletonListItem(S, 'pressPage', 'Press').icon(DocumentsIcon),
      singletonListItem(S, 'privacyPage', 'Privacy').icon(LockIcon),

      S.divider(),

      // Editions — primary content
      S.documentTypeListItem('edition').title('Editions').icon(ImageIcon),

      S.divider(),

      // Press — appearances + releases. Kit assets live on each Edition
      // (under "Press kit"), not here.
      S.listItem()
        .id('press')
        .title('Press')
        .icon(DocumentsIcon)
        .child(
          S.list()
            .title('Press')
            .items([
              S.documentTypeListItem('pressAppearance').title('Appearances').icon(LinkIcon),
              S.documentTypeListItem('pressRelease').title('Releases').icon(TransferIcon),
            ]),
        ),

      S.divider(),

      // People & organizations referenced from editions and press. The
      // editions that reference an artist show up in the document's
      // "Used on N pages" panel (see the `artist` location resolver).
      S.documentTypeListItem('artist').title('Artists').icon(UsersIcon),
      S.documentTypeListItem('organization').title('Organizations').icon(CaseIcon),

      // Anything else the schema adds that isn't a singleton or pressed-up
      // above — singletons and explicitly-pinned types are filtered to
      // avoid duplicate entries.
      ...S.documentTypeListItems().filter((item) => {
        const id = item.getId()
        if (!id) return false
        if (['edition', 'artist', 'organization'].includes(id)) return false
        if (['pressAppearance', 'pressRelease'].includes(id)) return false
        return !isSingletonType(id)
      }),
    ])
