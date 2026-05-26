import type { SchemaTypeDefinition } from 'sanity'
import { artist } from './documents/artist'
import { edition } from './documents/edition'
import { organization } from './documents/organization'
import {
  slideDuo,
  slideFeaturedPortrait,
  slideFeaturedStack,
  slideFull,
  slideTrio,
} from './objects/carouselSlide'
import { creditOrg, creditOrgList, creditText } from './objects/creditRow'
import { programData } from './objects/programData'
import { venueEntry } from './objects/venueEntry'

export const schemaTypes: SchemaTypeDefinition[] = [
  // Documents
  artist,
  edition,
  organization,
  // Objects
  creditOrg,
  creditOrgList,
  creditText,
  programData,
  venueEntry,
  slideFull,
  slideDuo,
  slideFeaturedPortrait,
  slideTrio,
  slideFeaturedStack,
]
