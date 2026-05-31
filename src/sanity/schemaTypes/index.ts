import type { SchemaTypeDefinition } from 'sanity'
import { artist } from './documents/artist'
import { edition } from './documents/edition'
import { homepage } from './documents/homepage'
import { organization } from './documents/organization'
import { siteSettings } from './documents/siteSettings'
import {
  slideDuo,
  slideFeaturedPortrait,
  slideFeaturedStack,
  slideFull,
  slideTrio,
} from './objects/carouselSlide'
import { creditOrg, creditOrgList, creditText } from './objects/creditRow'
import { heroSlide } from './objects/heroSlide'
import { programData } from './objects/programData'
import { venueEntry } from './objects/venueEntry'

export const schemaTypes: SchemaTypeDefinition[] = [
  // Singletons
  siteSettings,
  homepage,
  // Documents
  artist,
  edition,
  organization,
  // Objects
  creditOrg,
  creditOrgList,
  creditText,
  heroSlide,
  programData,
  venueEntry,
  slideFull,
  slideDuo,
  slideFeaturedPortrait,
  slideTrio,
  slideFeaturedStack,
]
