/**
 * Import in-person editions (2022–2025) into Sanity.
 *
 * For each edition:
 *   - Downloads heroImage, thumbImage, and every carousel image from its current
 *     Blob URL and re-uploads to Sanity assets.
 *   - Resolves artist names → references to existing `artist-<slug>` docs.
 *   - Resolves credit org names → references to existing `org-<slug>` docs
 *     (using the same alias map as the org import).
 *   - Idempotent: skips an edition if `edition-<year>` already exists.
 *
 * 2021 stays as a static page and is not imported.
 *
 * Usage:
 *   pnpm exec tsx scripts/sanity-import-editions.ts          # apply
 *   pnpm exec tsx scripts/sanity-import-editions.ts --dry    # preview, no writes
 *   pnpm exec tsx scripts/sanity-import-editions.ts --years 2024,2025
 */

import './_load-env'

import { createClient, type SanityClient } from '@sanity/client'
import { edition2022 } from '../src/data/editions/2022'
import { edition2023 } from '../src/data/editions/2023'
import { edition2024 } from '../src/data/editions/2024'
import { edition2025 } from '../src/data/editions/2025'
import type {
  CarouselImage,
  CarouselSlide,
  CreditEntry,
  Edition,
  ImageData,
} from '../src/types/edition'

const ALL_EDITIONS: Edition[] = [edition2022, edition2023, edition2024, edition2025]

const ORG_ALIASES: Record<string, string> = {
  'union-of-visual-artists-of-romania': 'uapr',
  'institutul-liszt': 'liszt-institute',
  'senat-gallery': 'galeria-senat',
  'una-gallery': 'unagaleria',
  'galeria-the-institute': 'the-institute',
  'national-heritage-institute': 'national-institute-of-heritage',
  'combnat-ro': 'combinat-ro',
  'h-d-u': 'h-d-u-cultural-association',
  'national-university-of-arts-bucharest': 'unarte',
}

const SLIDE_TYPE_BY_LAYOUT: Record<CarouselSlide['layout'], string> = {
  full: 'slideFull',
  duo: 'slideDuo',
  'featured-portrait': 'slideFeaturedPortrait',
  trio: 'slideTrio',
  'featured-stack': 'slideFeaturedStack',
}

function slugify(name: string): string {
  return name
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function canonicalOrgSlug(name: string): string | undefined {
  const slug = slugify(name.trim())
  if (!slug) return undefined
  return ORG_ALIASES[slug] ?? slug
}

interface ImageRef {
  _type: 'image'
  asset: { _type: 'reference'; _ref: string }
  alt: string
}

async function uploadFromUrl(
  client: SanityClient,
  url: string,
  cache: Map<string, string>,
): Promise<string> {
  const cached = cache.get(url)
  if (cached) return cached
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`)
  const buf = Buffer.from(await res.arrayBuffer())
  const filename = url.split('/').pop()?.split('?')[0] ?? 'image'
  const asset = await client.assets.upload('image', buf, { filename })
  cache.set(url, asset._id)
  return asset._id
}

async function imageRef(ctx: BuildContext, img: ImageData, label: string): Promise<ImageRef> {
  process.stdout.write(`    ↳ ${label} `)
  const assetId = await uploadFromUrl(ctx.client, img.src, ctx.cache)
  console.log(assetId.split('-')[1] ?? 'ok')
  return {
    _type: 'image',
    asset: { _type: 'reference', _ref: assetId },
    alt: img.alt,
  }
}

interface BuildContext {
  client: SanityClient
  cache: Map<string, string>
  artistSlugByName: Map<string, string>
  knownOrgIds: Set<string>
}

function artistRef(ctx: BuildContext, name: string): { _type: 'reference'; _ref: string } {
  const slug = ctx.artistSlugByName.get(name) ?? slugify(name)
  return { _type: 'reference', _ref: `artist-${slug}`, _key: `artist-${slug}` } as never
}

function orgRefOrSkip(
  ctx: BuildContext,
  name: string,
): { _type: 'reference'; _ref: string } | undefined {
  const slug = canonicalOrgSlug(name)
  if (!slug) return undefined
  const id = `org-${slug}`
  if (!ctx.knownOrgIds.has(id)) return undefined
  return { _type: 'reference', _ref: id }
}

function withKey<T>(item: T, prefix: string, index: number): T & { _key: string } {
  return { ...item, _key: `${prefix}-${index}` }
}

function mapCredits(ctx: BuildContext, year: number, credits: CreditEntry[]): unknown[] {
  const out: unknown[] = []
  let unknownOrgs: string[] = []
  credits.forEach((row, i) => {
    const _key = `credit-${i}`
    if (row.logo) {
      const ref = orgRefOrSkip(ctx, row.value)
      if (!ref) {
        unknownOrgs.push(row.value)
        out.push({ _key, _type: 'creditText', type: row.type, label: row.label, value: row.value })
        return
      }
      out.push({
        _key,
        _type: 'creditOrg',
        type: row.type,
        label: row.label,
        organization: ref,
        ...(row.detail ? { detail: row.detail } : {}),
      })
      return
    }
    if (row.type === 'partner') {
      const refs: Array<{ _type: 'reference'; _ref: string; _key: string }> = []
      row.value.split('\n').forEach((line, j) => {
        const ref = orgRefOrSkip(ctx, line)
        if (ref) refs.push({ ...ref, _key: `${_key}-org-${j}` })
        else unknownOrgs.push(line.trim())
      })
      if (refs.length) {
        out.push({
          _key,
          _type: 'creditOrgList',
          type: row.type,
          label: row.label,
          organizations: refs,
        })
        return
      }
    }
    out.push({ _key, _type: 'creditText', type: row.type, label: row.label, value: row.value })
  })
  if (unknownOrgs.length) {
    console.log(`  ⚠ ${year}: ${unknownOrgs.length} credit name(s) without matching org doc:`)
    for (const n of unknownOrgs) console.log(`    - ${n}`)
  }
  return out
}

async function mapCarousel(
  ctx: BuildContext,
  carousel: CarouselSlide[] | undefined,
): Promise<unknown[] | undefined> {
  if (!carousel?.length) return undefined
  const out: unknown[] = []
  for (let i = 0; i < carousel.length; i += 1) {
    const slide = carousel[i]!
    const images: Array<{ _key: string; caption: string; image: ImageRef }> = []
    for (let j = 0; j < slide.images.length; j += 1) {
      const ci: CarouselImage = slide.images[j]!
      const ref = await imageRef(ctx, ci.image, `carousel slide ${i + 1} image ${j + 1}`)
      images.push({ _key: `img-${i}-${j}`, caption: ci.caption, image: ref })
    }
    out.push({ _key: `slide-${i}`, _type: SLIDE_TYPE_BY_LAYOUT[slide.layout], images })
  }
  return out
}

async function buildEditionDoc(ctx: BuildContext, edition: Edition): Promise<Record<string, unknown>> {
  console.log(`\nBuilding edition-${edition.year} (${edition.theme})…`)
  const hero = await imageRef(ctx, edition.heroImage, 'hero')
  const thumb = edition.thumbImage ? await imageRef(ctx, edition.thumbImage, 'thumb') : undefined
  const carousel = await mapCarousel(ctx, edition.carousel)

  const venues = edition.venues.map((v, i) => withKey(v, 'venue', i))

  const program = edition.program
    ? {
        dates: edition.program.dates,
        blocks: edition.program.blocks.map((b, i) =>
          withKey(
            {
              type: b.type,
              title: b.title,
              dates: b.dates,
              description: b.description,
              column: b.column,
              ...(b.location ? { location: b.location } : {}),
              ...(b.format ? { format: b.format } : {}),
            },
            'block',
            i,
          ),
        ),
        ...(edition.program.films?.length
          ? {
              films: edition.program.films.map((f, i) =>
                withKey(
                  {
                    date: f.date,
                    title: f.title,
                    ...(f.note ? { note: f.note } : {}),
                  },
                  'film',
                  i,
                ),
              ),
            }
          : {}),
        sftfBanner: edition.program.sftfBanner,
      }
    : undefined

  const artists = edition.artists.map((name, i) => ({ ...artistRef(ctx, name), _key: `artist-${i}` }))
  const credits = mapCredits(ctx, edition.year, edition.credits)

  return {
    _id: `edition-${edition.year}`,
    _type: 'edition',
    year: edition.year,
    title: edition.title,
    theme: edition.theme,
    themeHighlight: edition.themeHighlight,
    dateTape: edition.dateTape,
    heroImage: hero,
    ...(thumb ? { thumbImage: thumb } : {}),
    manifesto: edition.manifesto,
    themeSection: edition.themeSection,
    artists,
    venues,
    ...(program ? { program } : {}),
    ...(carousel ? { carousel } : {}),
    credits,
  }
}

async function main() {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
  const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION
  const token = process.env.SANITY_API_WRITE_TOKEN
  if (!projectId || !dataset || !apiVersion || !token) {
    throw new Error(
      'Missing env vars: NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, NEXT_PUBLIC_SANITY_API_VERSION, SANITY_API_WRITE_TOKEN',
    )
  }

  const dryRun = process.argv.includes('--dry')
  const yearsArgIdx = process.argv.indexOf('--years')
  const yearFilter =
    yearsArgIdx >= 0 && process.argv[yearsArgIdx + 1]
      ? new Set(process.argv[yearsArgIdx + 1]!.split(',').map((s) => Number(s.trim())))
      : undefined

  const client = createClient({ projectId, dataset, apiVersion, token, useCdn: false })

  console.log('Fetching existing artist + org IDs…')
  const [artistRows, orgIds, editionIds] = await Promise.all([
    client.fetch<Array<{ _id: string; name: string }>>(`*[_type == "artist"]{ _id, name }`),
    client.fetch<string[]>(`*[_type == "organization"]._id`),
    client.fetch<string[]>(`*[_type == "edition"]._id`),
  ])
  console.log(
    `  artists: ${artistRows.length}, orgs: ${orgIds.length}, existing editions: ${editionIds.length}`,
  )

  const artistSlugByName = new Map<string, string>()
  for (const row of artistRows) {
    const slug = row._id.startsWith('artist-') ? row._id.slice('artist-'.length) : slugify(row.name)
    artistSlugByName.set(row.name, slug)
  }

  const ctx: BuildContext = {
    client,
    cache: new Map(),
    artistSlugByName,
    knownOrgIds: new Set(orgIds),
  }

  const existingEditions = new Set(editionIds.map((id) => id.replace(/^drafts\./, '')))
  const targets = ALL_EDITIONS.filter(
    (e) => (!yearFilter || yearFilter.has(e.year)) && !existingEditions.has(`edition-${e.year}`),
  )

  if (!targets.length) {
    console.log('Nothing to import — all targeted editions already present.')
    return
  }

  console.log(`Will import ${targets.length} edition(s): ${targets.map((e) => e.year).join(', ')}`)

  if (dryRun) {
    console.log('(dry run — skipping image uploads and writes)')
    return
  }

  for (const edition of targets) {
    const doc = await buildEditionDoc(ctx, edition)
    await client.create(doc as Parameters<typeof client.create>[0])
    console.log(`  ✓ created edition-${edition.year}`)
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
