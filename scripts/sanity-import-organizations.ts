/**
 * Import organizations into Sanity from the existing edition credit rows.
 *
 * Sources:
 *   - Logoed credit rows (`logo` set) → one org with logo + alt + the row's `value` as name.
 *   - `type: 'partner'` credit rows → split the row's `value` by newlines; each line is a name-only org.
 *
 * Idempotent: stable `_id` of `org-<slug>`. Re-runs only create missing docs.
 * Logo assets are uploaded once per org (skipped if the org already exists).
 *
 * Usage:
 *   pnpm exec tsx scripts/sanity-import-organizations.ts          # apply
 *   pnpm exec tsx scripts/sanity-import-organizations.ts --dry    # preview, no writes
 */

import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { createClient } from '@sanity/client'
import { getAllEditionYears, getEdition } from '../src/data/editions'

if (typeof process.loadEnvFile === 'function') {
  try {
    process.loadEnvFile('.env.local')
  } catch {
    // .env.local is optional
  }
}

const dryRun = process.argv.includes('--dry')

/**
 * Manual dedup of name variants that slug-based dedup can't catch
 * (translation pairs, word-order swaps, typos, abbreviations).
 * Maps `alias slug` → `canonical slug`.
 */
const ALIASES: Record<string, string> = {
  // Romanian → English translation pair of the parent body UAPR
  'union-of-visual-artists-of-romania': 'uapr',
  // International rebrand of "Institutul Liszt"
  'institutul-liszt': 'liszt-institute',
  // "SENAT Gallery" → "Galeria SENAT" (most-recent / Romanian form wins)
  'senat-gallery': 'galeria-senat',
  // "UNA Gallery" → "UNAgaleria"
  'una-gallery': 'unagaleria',
  // "Galeria The Institute" → "The Institute"
  'galeria-the-institute': 'the-institute',
  // Word order swap; the official name is "Institutul Național al Patrimoniului"
  'national-heritage-institute': 'national-institute-of-heritage',
  // Typo in the 2022 source data
  'combnat-ro': 'combinat-ro',
  // Abbreviation → full name
  'h-d-u': 'h-d-u-cultural-association',
  // Romanian abbreviation UNARTE → "Universitatea Națională de Arte București"
  'national-university-of-arts-bucharest': 'unarte',
}

interface CollectedOrg {
  name: string
  logoFile?: string
  logoAlt?: string
  sources: Set<string>
}

function slugify(name: string): string {
  return name
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function canonicalSlug(slug: string): string {
  return ALIASES[slug] ?? slug
}

async function collect(): Promise<Map<string, CollectedOrg>> {
  const bySlug = new Map<string, CollectedOrg>()
  const upsert = (name: string, source: string, logo?: { file: string; alt: string }) => {
    const trimmed = name.trim()
    if (!trimmed) return
    const rawSlug = slugify(trimmed)
    if (!rawSlug) return
    const slug = canonicalSlug(rawSlug)
    const existing = bySlug.get(slug)
    if (existing) {
      existing.sources.add(source)
      if (logo && !existing.logoFile) {
        existing.logoFile = logo.file
        existing.logoAlt = logo.alt
      }
      return
    }
    const entry: CollectedOrg = { name: trimmed, sources: new Set([source]) }
    if (logo) {
      entry.logoFile = logo.file
      entry.logoAlt = logo.alt
    }
    bySlug.set(slug, entry)
  }

  for (const year of await getAllEditionYears()) {
    const edition = await getEdition(year, { perspective: 'published', stega: false })
    if (!edition) continue
    for (const credit of edition.credits) {
      const source = `${year} · ${credit.label}`
      if (credit.logo) {
        upsert(credit.value, source, { file: credit.logo, alt: credit.logoAlt })
        continue
      }
      if (credit.type === 'partner') {
        for (const line of credit.value.split('\n')) upsert(line, source)
      }
    }
  }
  return bySlug
}

interface AssetRef {
  _id: string
}

async function uploadLogo(
  client: ReturnType<typeof createClient>,
  filePath: string,
): Promise<AssetRef> {
  const abs = resolve(process.cwd(), filePath.replace(/^\//, 'public/'))
  const buffer = readFileSync(abs)
  const filename = abs.split('/').pop() ?? 'logo.png'
  const asset = await client.assets.upload('image', buffer, { filename })
  return { _id: asset._id }
}

function reportSimilar(slugs: string[]): void {
  const norms = slugs.map((s) => ({ slug: s, norm: s.replace(/-/g, '') }))
  const flagged: Array<[string, string]> = []
  for (let i = 0; i < norms.length; i += 1) {
    const a = norms[i]
    if (!a) continue
    for (let j = i + 1; j < norms.length; j += 1) {
      const b = norms[j]
      if (!b) continue
      if (a.norm === b.norm) continue
      if (a.norm.includes(b.norm) || b.norm.includes(a.norm)) {
        if (Math.min(a.norm.length, b.norm.length) >= 4) flagged.push([a.slug, b.slug])
      }
    }
  }
  if (flagged.length) {
    console.log('\nPossible duplicate names (review in Studio after import):')
    for (const [a, b] of flagged) console.log(`  ${a}  <—>  ${b}`)
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

  const bySlug = await collect()
  console.log(`Collected ${bySlug.size} unique organizations from credit rows.`)

  if (dryRun) {
    for (const [slug, org] of bySlug) {
      const logoMark = org.logoFile ? ' [logo]' : ''
      console.log(`  ${slug.padEnd(50)} ${org.name}${logoMark}`)
      for (const src of org.sources) console.log(`    ↳ ${src}`)
    }
    reportSimilar([...bySlug.keys()])
    console.log('\n(dry run — no documents created)')
    return
  }

  const client = createClient({ projectId, dataset, apiVersion, token, useCdn: false })
  const existingIds = await client.fetch<string[]>(`*[_type == "organization"]._id`)
  const existing = new Set(existingIds)

  const tx = client.transaction()
  let created = 0
  let skipped = 0

  for (const [slug, org] of bySlug) {
    const _id = `org-${slug}`
    if (existing.has(_id) || existing.has(`drafts.${_id}`)) {
      skipped += 1
      continue
    }

    let logo: Record<string, unknown> | undefined
    if (org.logoFile) {
      console.log(`  Uploading logo for ${org.name}…`)
      const asset = await uploadLogo(client, org.logoFile)
      logo = {
        _type: 'image',
        asset: { _type: 'reference', _ref: asset._id },
        alt: org.logoAlt ?? org.name,
      }
    }

    tx.create({
      _id,
      _type: 'organization',
      name: org.name,
      slug: { _type: 'slug', current: slug },
      ...(logo ? { logo } : {}),
    })
    created += 1
  }

  if (created > 0) {
    await tx.commit()
  }
  console.log(`Done — created ${created}, skipped ${skipped} already-present.`)
  reportSimilar([...bySlug.keys()])
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
