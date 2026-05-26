/**
 * Import existing artist names from src/data/editions into Sanity as stub
 * artist documents.
 *
 * - Dedupes across every registered edition.
 * - Stable, slug-derived _id (`artist-<slug>`) so re-runs are idempotent.
 * - Creates only — never overwrites. To re-seed, delete docs in Studio first.
 *
 * Usage:
 *   pnpm exec tsx scripts/sanity-import-artists.ts          # apply
 *   pnpm exec tsx scripts/sanity-import-artists.ts --dry    # preview, no writes
 */

import { createClient } from '@sanity/client'
import { ALL_ARTISTS } from '../src/data/artists'

if (typeof process.loadEnvFile === 'function') {
  try {
    process.loadEnvFile('.env.local')
  } catch {
    // .env.local is optional
  }
}

const dryRun = process.argv.includes('--dry')

function slugify(name: string): string {
  return name
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
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

  const names = [...ALL_ARTISTS].map((n) => n.trim()).filter(Boolean)
  console.log(`Found ${names.length} unique artist names across all editions.`)

  const bySlug = new Map<string, string[]>()
  for (const name of names) {
    const s = slugify(name)
    const arr = bySlug.get(s) ?? []
    arr.push(name)
    bySlug.set(s, arr)
  }
  const collisions = [...bySlug.entries()].filter(([, ns]) => ns.length > 1)
  if (collisions.length) {
    console.error('Slug collisions detected:')
    for (const [slug, ns] of collisions) console.error(`  ${slug} <- ${ns.join(', ')}`)
    console.error('Resolve manually before re-running.')
    process.exit(1)
  }

  if (dryRun) {
    for (const name of names) {
      console.log(`  ${slugify(name).padEnd(40)} ${name}`)
    }
    console.log('(dry run — no documents created)')
    return
  }

  const client = createClient({ projectId, dataset, apiVersion, token, useCdn: false })

  const existingIds = await client.fetch<string[]>(`*[_type == "artist"]._id`)
  const existing = new Set(existingIds)

  const tx = client.transaction()
  let created = 0
  let skipped = 0
  for (const name of names) {
    const slug = slugify(name)
    const _id = `artist-${slug}`
    if (existing.has(_id) || existing.has(`drafts.${_id}`)) {
      skipped += 1
      continue
    }
    tx.create({
      _id,
      _type: 'artist',
      name,
      slug: { _type: 'slug', current: slug },
    })
    created += 1
  }

  if (created > 0) {
    await tx.commit()
  }
  console.log(`Done — created ${created}, skipped ${skipped} already-present.`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
