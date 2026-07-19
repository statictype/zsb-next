import type { StructureResolver } from 'sanity/structure'
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
  TagIcon,
  TagsIcon,
  TransferIcon,
  UsersIcon,
} from './icons'
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

      // Program & calendar — venues are reused across editions (events
      // reference them); the type lists are the team-managed taxonomies the
      // calendar filters and venues view enumerate. See ADR 0014.
      S.documentTypeListItem('venue').title('Venues').icon(PinIcon),
      S.listItem()
        .id('programTypes')
        .title('Types')
        .icon(TagIcon)
        .child(
          S.list()
            .title('Types')
            .items([
              S.documentTypeListItem('eventType').title('Event types').icon(TagIcon),
              S.documentTypeListItem('venueType').title('Venue types').icon(TagsIcon),
            ]),
        ),

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
        if (['venue', 'eventType', 'venueType'].includes(id)) return false
        return !isSingletonType(id)
      }),
    ])
