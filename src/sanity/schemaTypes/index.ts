import type { SchemaTypeDefinition } from 'sanity'
import { aboutPage } from '@/sanity/schemaTypes/documents/aboutPage'
import { artist } from '@/sanity/schemaTypes/documents/artist'
import { edition } from '@/sanity/schemaTypes/documents/edition'
import { eventType } from '@/sanity/schemaTypes/documents/eventType'
import { homepage } from '@/sanity/schemaTypes/documents/homepage'
import { organization } from '@/sanity/schemaTypes/documents/organization'
import { partnersPage } from '@/sanity/schemaTypes/documents/partnersPage'
import { pressAppearance } from '@/sanity/schemaTypes/documents/pressAppearance'
import { pressPage } from '@/sanity/schemaTypes/documents/pressPage'
import { pressRelease } from '@/sanity/schemaTypes/documents/pressRelease'
import { privacyPage } from '@/sanity/schemaTypes/documents/privacyPage'
import { siteSettings } from '@/sanity/schemaTypes/documents/siteSettings'
import { venue } from '@/sanity/schemaTypes/documents/venue'
import { venueType } from '@/sanity/schemaTypes/documents/venueType'
import { visitPage } from '@/sanity/schemaTypes/documents/visitPage'
import { amenity } from '@/sanity/schemaTypes/objects/amenity'
import { carouselSlide } from '@/sanity/schemaTypes/objects/carouselSlide'
import { creditOrg, creditOrgList, creditText } from '@/sanity/schemaTypes/objects/creditRow'
import { event } from '@/sanity/schemaTypes/objects/event'
import { faqItem } from '@/sanity/schemaTypes/objects/faqItem'
import { heroSlide } from '@/sanity/schemaTypes/objects/heroSlide'
import { pageHero } from '@/sanity/schemaTypes/objects/pageHero'
import { pillar } from '@/sanity/schemaTypes/objects/pillar'
import { transportRoute } from '@/sanity/schemaTypes/objects/transportRoute'
import { whyPoint } from '@/sanity/schemaTypes/objects/whyPoint'

export const schemaTypes: SchemaTypeDefinition[] = [
  // Singletons
  siteSettings,
  homepage,
  aboutPage,
  partnersPage,
  visitPage,
  pressPage,
  privacyPage,
  // Documents
  artist,
  edition,
  organization,
  pressAppearance,
  pressRelease,
  // Program & calendar
  venue,
  eventType,
  venueType,
  // Objects
  amenity,
  creditOrg,
  creditOrgList,
  creditText,
  event,
  faqItem,
  heroSlide,
  pageHero,
  pillar,
  transportRoute,
  whyPoint,
  carouselSlide,
]
