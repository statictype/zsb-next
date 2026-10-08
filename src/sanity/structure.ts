import type { StructureResolver } from 'sanity/structure'
import {
  CaseIcon,
  CogIcon,
  CubeIcon,
  DocumentsIcon,
  HeartIcon,
  HomeIcon,
  ImageIcon,
  InfoOutlineIcon,
  LinkIcon,
  LockIcon,
  PinIcon,
  StarIcon,
  TagIcon,
  TagsIcon,
  TransferIcon,
  UsersIcon,
} from '@/sanity/icons'
import { isSingletonType, singletonListItem } from '@/sanity/lib/singleton'

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      singletonListItem(S, 'siteSettings', 'Site settings').icon(CogIcon),
      singletonListItem(S, 'homepage', 'Homepage').icon(HomeIcon),
      singletonListItem(S, 'aboutPage', 'About').icon(InfoOutlineIcon),
      singletonListItem(S, 'partnersPage', 'Partners').icon(HeartIcon),
      singletonListItem(S, 'visitPage', 'Visit').icon(PinIcon),
      singletonListItem(S, 'pressPage', 'Press').icon(DocumentsIcon),
      singletonListItem(S, 'privacyPage', 'Privacy').icon(LockIcon),

      S.divider(),

      S.documentTypeListItem('edition').title('Editions').icon(ImageIcon),

      S.divider(),

      singletonListItem(S, 'galeriaBeller', 'Galeria Beller').icon(StarIcon),

      S.divider(),

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

      S.documentTypeListItem('artist').title('Artists').icon(UsersIcon),
      S.documentTypeListItem('work').title('Works').icon(CubeIcon),
      S.documentTypeListItem('organization').title('Organizations').icon(CaseIcon),

      ...S.documentTypeListItems().filter((item) => {
        const id = item.getId()
        if (!id) return false
        if (['edition', 'artist', 'work', 'organization'].includes(id)) return false
        if (['pressAppearance', 'pressRelease'].includes(id)) return false
        if (['venue', 'eventType', 'venueType'].includes(id)) return false
        return !isSingletonType(id)
      }),
    ])
