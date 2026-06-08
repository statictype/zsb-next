/**
 * ZSB-54 — backfill `slug` on existing venue documents.
 *
 * Event URLs are slug-keyed (`events/[slug]`, ADR 0015); the venue segment uses
 * the venue's own `slug` field when set, else falls back to its slugified name.
 * This gives every existing venue a slug up front so editors can shorten it
 * (e.g. "combinatul-fondului-plastic" → "cfp") rather than starting from blank.
 *
 * Non-destructive + idempotent: venues that already carry a `slug` are skipped,
 * so re-runs are a no-op and a human-shortened slug is never clobbered. Slugs are
 * made unique across venues (a `-2`/`-3` suffix on collision). `raw` perspective
 * so published + any `drafts.` copies are both seen and patched.
 *
 * Usage:
 *   pnpm exec tsx scripts/sanity-backfill-venue-slugs.ts --dry   # preview, no writes
 *   pnpm exec tsx scripts/sanity-backfill-venue-slugs.ts         # apply
 */

import './_load-env'

import { createClient } from '@sanity/client'
import { slugify } from '../src/lib/slugify'

interface VenueDoc {
  _id: string
  name: string
  slug?: { current?: string } | null
}

async function main() {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
  const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION
  const token = process.env.SANITY_API_WRITE_TOKEN
  if (!projectId || !dataset || !apiVersion || !token) {
    console.error('Missing Sanity env (projectId / dataset / apiVersion / SANITY_API_WRITE_TOKEN).')
    process.exit(1)
  }

  const dryRun = process.argv.includes('--dry')
  const client = createClient({
    projectId,
    dataset,
    apiVersion,
    token,
    useCdn: false,
    perspective: 'raw',
  })

  const venues = await client.fetch<VenueDoc[]>(
    `*[_type == "venue"]{ _id, name, slug } | order(name asc)`,
  )

  // Reserve slugs already taken (by venues that have one) so backfilled slugs
  // stay unique against them and each other.
  const used = new Set<string>()
  for (const v of venues) {
    if (v.slug?.current) used.add(v.slug.current)
  }

  const tx = client.transaction()
  let patched = 0
  for (const v of venues) {
    if (v.slug?.current) {
      console.log(`  = ${v.name} → "${v.slug.current}" (already set, skipped)`)
      continue
    }
    const base = slugify(v.name)
    let slug = base || 'venue'
    let n = 2
    while (used.has(slug)) slug = `${base || 'venue'}-${n++}`
    used.add(slug)
    console.log(`  + ${v.name} → "${slug}"`)
    if (!dryRun) tx.patch(v._id, (p) => p.set({ slug: { _type: 'slug', current: slug } }))
    patched++
  }

  if (dryRun) {
    console.log(
      `\n[dry] would set ${patched} venue slug(s); ${venues.length - patched} already set.`,
    )
    return
  }
  if (patched > 0) {
    await tx.commit()
    console.log(`\n✓ Committed — ${patched} venue slug(s) set.`)
  } else {
    console.log('\nNothing to do — every venue already has a slug.')
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
