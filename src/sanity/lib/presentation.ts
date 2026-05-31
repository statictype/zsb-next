import { defineLocations } from 'sanity/presentation'

export const locations = {
  edition: defineLocations({
    select: { year: 'year', theme: 'theme' },
    resolve: (doc) => {
      const year = doc?.year
      if (!year) return { locations: [] }
      return {
        locations: [
          {
            title: doc.theme ? `${year} · ${doc.theme}` : String(year),
            href: `/editions/${year}`,
          },
          { title: 'All editions', href: '/editions' },
        ],
      }
    },
  }),
  artist: defineLocations({
    select: { name: 'name', slug: 'slug.current' },
    resolve: (doc) => {
      if (!doc?.slug) return { locations: [{ title: 'Artists index', href: '/artists' }] }
      return {
        locations: [
          { title: doc.name ?? 'Artist', href: `/artists/${doc.slug}` },
          { title: 'Artists index', href: '/artists' },
        ],
      }
    },
  }),
}
