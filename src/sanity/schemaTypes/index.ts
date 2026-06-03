import type { SchemaTypeDefinition } from 'sanity'
import { aboutPage } from './documents/aboutPage'
import { artist } from './documents/artist'
import { edition } from './documents/edition'
import { homepage } from './documents/homepage'
import { organization } from './documents/organization'
import { partnersPage } from './documents/partnersPage'
import { pressAppearance } from './documents/pressAppearance'
import { pressPage } from './documents/pressPage'
import { pressRelease } from './documents/pressRelease'
import { privacyPage } from './documents/privacyPage'
import { siteSettings } from './documents/siteSettings'
import { visitPage } from './documents/visitPage'
import { amenity } from './objects/amenity'
import { carouselSlide } from './objects/carouselSlide'
import { creditOrg, creditOrgList, creditText } from './objects/creditRow'
import { heroSlide } from './objects/heroSlide'
import { pageHero } from './objects/pageHero'
import { pillar } from './objects/pillar'
import { programData } from './objects/programData'
import { transportRoute } from './objects/transportRoute'
import { venueEntry } from './objects/venueEntry'
import { whyPoint } from './objects/whyPoint'

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
  // Objects
  amenity,
  creditOrg,
  creditOrgList,
  creditText,
  heroSlide,
  pageHero,
  pillar,
  programData,
  transportRoute,
  venueEntry,
  whyPoint,
  carouselSlide,
]
