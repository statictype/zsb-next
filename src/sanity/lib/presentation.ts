import { defineLocations } from 'sanity/presentation'

export const locations = {
  homepage: defineLocations({
    select: { _id: '_id' },
    resolve: () => ({ locations: [{ title: 'Homepage', href: '/' }] }),
  }),
  siteSettings: defineLocations({
    // Site settings affect every page; the footer is the most visible
    // surface, so we point editors at the homepage where they can see
    // both the footer and the social links in context.
    select: { _id: '_id' },
    resolve: () => ({
      locations: [{ title: 'Footer (home)', href: '/' }],
    }),
  }),
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
