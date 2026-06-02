/**
 * Import press content into Sanity.
 *
 *   pressAppearance — coverage of ZSB across outlets (TV, radio, articles)
 *   pressRelease    — official press releases per edition (PDF uploads)
 *
 * Sources from the original `src/data/press-appearances.ts` and
 * `src/data/press-releases.ts` (recovered from git history).
 *
 * Idempotent: looks up existing docs by `url` (appearances) or by
 * `title + edition` (releases) and skips them.
 *
 * Usage:
 *   pnpm exec tsx scripts/sanity-import-press.ts                # apply all
 *   pnpm exec tsx scripts/sanity-import-press.ts --dry          # preview
 *   pnpm exec tsx scripts/sanity-import-press.ts --only appearances
 *   pnpm exec tsx scripts/sanity-import-press.ts --only releases
 */

import './_load-env'

import { createClient, type SanityClient } from '@sanity/client'

// ---------------------------------------------------------------------------
// Appearances
// ---------------------------------------------------------------------------

type AppearanceType = 'youtube' | 'vimeo' | 'soundcloud' | 'article' | 'tv'

interface AppearanceSource {
  type: AppearanceType
  title: string
  year: number
  tag: string
  url: string
  excerpt?: string
}

const APPEARANCES: AppearanceSource[] = [
  {
    type: 'soundcloud',
    title: 'Reka Csapo Dup, Radio Romania International',
    year: 2025,
    tag: 'interview',
    url: 'https://soundcloud.com/radioromaniainternational/interviu-reka-csapo-dup-curatoare-despre-zilele-sculpturii-bucuresti-2025',
  },
  {
    type: 'youtube',
    title: 'Intrare Libera, TVR Cultural',
    year: 2024,
    tag: 'TV',
    url: 'https://youtu.be/CI8Dq3I9CTI?si=PinacaxLyfpKi59J',
  },
  {
    type: 'youtube',
    title: 'Jurnal Cultural, TVR Cultural',
    year: 2023,
    tag: 'TV',
    url: 'https://www.youtube.com/watch?v=d2DExa1AhpY&list=PLga_ov2ae3I0lXakqsZFOkonAoDz9jxSU&index=33',
  },
  {
    type: 'vimeo',
    title: 'Video summary, SensoArte',
    year: 2023,
    tag: 'interview',
    url: 'https://vimeo.com/820863868',
  },
]

async function importAppearances(client: SanityClient, dryRun: boolean): Promise<void> {
  console.log('\nFetching existing pressAppearance URLs…')
  const existingUrls = new Set(
    await client.fetch<string[]>(`*[_type == "pressAppearance" && defined(url)].url`),
  )
  console.log(`  found ${existingUrls.size} existing`)

  const targets = APPEARANCES.filter((a) => !existingUrls.has(a.url))
  if (!targets.length) {
    console.log('  all appearances already imported')
    return
  }
  console.log(`Will create ${targets.length} appearance(s):`)
  for (const a of targets) console.log(`  • [${a.year}] ${a.title}`)

  if (dryRun) {
    console.log('(dry run — no writes)')
    return
  }

  for (const a of targets) {
    const doc: Record<string, unknown> = {
      _type: 'pressAppearance',
      type: a.type,
      title: a.title,
      year: a.year,
      tag: a.tag,
      url: a.url,
    }
    if (a.excerpt) doc.excerpt = a.excerpt
    const created = await client.create(doc as Parameters<typeof client.create>[0])
    console.log(`  ✓ ${created._id} — ${a.title}`)
  }
}

// ---------------------------------------------------------------------------
// Releases (stub — wire up when PDFs exist)
// ---------------------------------------------------------------------------

async function importReleases(_client: SanityClient, _dryRun: boolean): Promise<void> {
  console.log(
    '\nSkipping releases: no PDF source configured. Add PDFs (local path or Blob URL) and a builder here.',
  )
}

// ---------------------------------------------------------------------------
// main
// ---------------------------------------------------------------------------

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
  const onlyIdx = process.argv.indexOf('--only')
  const only =
    onlyIdx >= 0 && process.argv[onlyIdx + 1] ? process.argv[onlyIdx + 1] : undefined

  const client = createClient({ projectId, dataset, apiVersion, token, useCdn: false })

  if (!only || only === 'appearances') await importAppearances(client, dryRun)
  if (!only || only === 'releases') await importReleases(client, dryRun)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
