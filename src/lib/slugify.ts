// URL-safe slug from arbitrary text: drop diacritics (Bucharest venue names use
// ă/î/ș/ț), lowercase, collapse every run of non-alphanumerics to a single
// hyphen, and trim leading/trailing hyphens. Pure and dependency-free so it can
// be shared by the Sanity schema (slug `source`), the data layer (event-slug
// derivation), and the calendar's filter slugs.
export function slugify(input: string): string {
  return input
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
