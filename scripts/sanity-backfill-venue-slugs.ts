/** Usage: pnpm exec tsx scripts/sanity-backfill-venue-slugs.ts [--dry]. */

import '@scripts/_load-env'

import { createClient } from '@sanity/client'
import { slugify } from '@/lib/slugify'

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
