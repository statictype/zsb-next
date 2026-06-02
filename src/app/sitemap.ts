import type { MetadataRoute } from 'next'
import { getAllEditionYears } from '@/data/editions'
import { SITE_URL } from '@/lib/constants'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const years = await getAllEditionYears()
  const editionEntries = years.map((year) => ({
    url: `${SITE_URL}/editions/${year}`,
    lastModified: new Date(),
    changeFrequency: 'yearly' as const,
    priority: 0.8,
  }))

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${SITE_URL}/editions`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.8,
    },
    ...editionEntries,
    {
      url: `${SITE_URL}/artists`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/visit`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/partners`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/press`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ]
}
