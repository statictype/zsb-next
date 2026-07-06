import { createClient } from 'next-sanity'
import { apiVersion, dataset, projectId } from '../env'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  // Explicit so drafts are never accidentally rendered on the public site.
  // `sanityFetch` overrides this per call when draft mode is on.
  perspective: 'published',
})
