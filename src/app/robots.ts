import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/constants'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // /studio/ is the embedded CMS; /api/ is non-content (route handlers,
      // revalidation). AI crawlers stay allow-all elsewhere on purpose — more
      // crawl access feeds more AEO citations.
      disallow: ['/studio/', '/api/'],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
