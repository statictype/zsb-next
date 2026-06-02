/**
 * Patch existing edition docs (2022–2025) with a `pressKit` object
 * containing `poster` + `coverPhoto` images. Sources from the original
 * `src/data/media-kit.ts` (recovered from git).
 *
 * Idempotent: skips an edition that already has `pressKit` set.
 *
 * Usage:
 *   pnpm exec tsx scripts/sanity-patch-edition-press-kits.ts          # apply
 *   pnpm exec tsx scripts/sanity-patch-edition-press-kits.ts --dry    # preview
 *   pnpm exec tsx scripts/sanity-patch-edition-press-kits.ts --years 2024,2025
 */

import './_load-env'

import { createClient, type SanityClient } from '@sanity/client'

interface KitSource {
  year: number
  poster: { src: string; alt: string }
  coverPhoto: { src: string; alt: string }
}

const BLOB_BASE = process.env.NEXT_PUBLIC_BLOB_URL
function blobUrl(path: string): string {
  if (!BLOB_BASE) throw new Error('Missing NEXT_PUBLIC_BLOB_URL')
  return `${BLOB_BASE.replace(/\/$/, '')}/${path.replace(/^\//, '')}`
}

function kitSources(): KitSource[] {
  return [
    {
      year: 2025,
      poster: { src: blobUrl('2025/poster-zsb-2025.jpg'), alt: 'ZSB 2025 Poster' },
      coverPhoto: { src: blobUrl('2025/1-cover-event.jpg'), alt: 'ZSB 2025 Cover' },
    },
    {
      year: 2024,
      poster: {
        src: blobUrl('2024/kv_zsb_2024_fara_logouri-01.jpg'),
        alt: 'ZSB 2024 Poster',
      },
      coverPhoto: { src: blobUrl('2024/cover.jpg'), alt: 'ZSB 2024 Cover' },
    },
    {
      year: 2023,
      poster: { src: blobUrl('2023/poster-zsb-2023.jpg'), alt: 'ZSB 2023 Poster' },
      coverPhoto: { src: blobUrl('2023/cover.jpg'), alt: 'ZSB 2023 Cover' },
    },
    {
      year: 2022,
      poster: { src: blobUrl('2022/poster-zsb-2022.jpg'), alt: 'ZSB 2022 Poster' },
      coverPhoto: { src: blobUrl('2022/cover-image.jpg'), alt: 'ZSB 2022 Cover' },
    },
  ]
}

interface UploadContext {
  client: SanityClient
  cache: Map<string, string>
  dryRun: boolean
}

async function uploadAsset(
  ctx: UploadContext,
  source: string,
  label: string,
): Promise<string | null> {
  const cached = ctx.cache.get(source)
  if (cached) return cached
  process.stdout.write(`    ↳ ${label} `)
  if (ctx.dryRun) {
    const fake = `image-dryrun-${ctx.cache.size}`
    ctx.cache.set(source, fake)
    console.log('(dry)')
    return fake
  }
  const res = await fetch(source)
  if (res.status === 404) {
    console.log('SKIPPED (404)')
    return null
  }
  if (!res.ok) throw new Error(`Failed to fetch ${source}: ${res.status}`)
  const buf = Buffer.from(await res.arrayBuffer())
  const filename = source.split('/').pop()?.split('?')[0] ?? 'image'
  const asset = await ctx.client.assets.upload('image', buf, { filename })
  ctx.cache.set(source, asset._id)
  console.log(asset._id.split('-')[1] ?? 'ok')
  return asset._id
}

async function imageRef(
  ctx: UploadContext,
  src: string,
  alt: string,
  label: string,
): Promise<
  { _type: 'image'; asset: { _type: 'reference'; _ref: string }; alt: string } | null
> {
  const id = await uploadAsset(ctx, src, label)
  if (!id) return null
  return { _type: 'image', asset: { _type: 'reference', _ref: id }, alt }
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
  if (!BLOB_BASE) throw new Error('Missing NEXT_PUBLIC_BLOB_URL')

  const dryRun = process.argv.includes('--dry')
  const yearsArgIdx = process.argv.indexOf('--years')
  const yearFilter =
    yearsArgIdx >= 0 && process.argv[yearsArgIdx + 1]
      ? new Set(process.argv[yearsArgIdx + 1]!.split(',').map((s) => Number(s.trim())))
      : undefined

  const client = createClient({ projectId, dataset, apiVersion, token, useCdn: false })

  console.log('Fetching existing edition pressKit state…')
  const editionState = await client.fetch<Array<{ _id: string; year: number; hasKit: boolean }>>(
    `*[_type == "edition" && year >= 2022]{ _id, year, "hasKit": defined(pressKit.poster) || defined(pressKit.coverPhoto) }`,
  )
  const stateByYear = new Map<number, { _id: string; hasKit: boolean }>(
    editionState.map((e) => [e.year, { _id: e._id, hasKit: e.hasKit }]),
  )
  console.log(
    `  ${editionState.length} editions; with pressKit already: ${
      editionState.filter((e) => e.hasKit).map((e) => e.year).join(', ') || '(none)'
    }`,
  )

  const targets = kitSources().filter((src) => {
    if (yearFilter && !yearFilter.has(src.year)) return false
    const state = stateByYear.get(src.year)
    if (!state) {
      console.log(`  ⚠ skipping ${src.year}: no edition doc`)
      return false
    }
    if (state.hasKit) {
      console.log(`  – skipping ${src.year}: pressKit already set`)
      return false
    }
    return true
  })

  if (!targets.length) {
    console.log('Nothing to patch.')
    return
  }
  console.log(`Will patch ${targets.length}: ${targets.map((t) => t.year).join(', ')}`)
  if (dryRun) console.log('(dry run — image uploads stubbed, no writes)')

  const ctx: UploadContext = { client, cache: new Map(), dryRun }

  for (const src of targets) {
    const state = stateByYear.get(src.year)!
    console.log(`\nBuilding pressKit for ${src.year}…`)
    const poster = await imageRef(ctx, src.poster.src, src.poster.alt, `${src.year} poster`)
    const coverPhoto = await imageRef(
      ctx,
      src.coverPhoto.src,
      src.coverPhoto.alt,
      `${src.year} coverPhoto`,
    )
    if (!poster && !coverPhoto) {
      console.log(`  ⚠ skipping ${state._id}: both poster and coverPhoto missing`)
      continue
    }
    const pressKit: Record<string, unknown> = {}
    if (poster) pressKit.poster = poster
    if (coverPhoto) pressKit.coverPhoto = coverPhoto
    if (dryRun) {
      console.log(`  ✓ would patch ${state._id}.pressKit (${Object.keys(pressKit).join(' + ')})`)
      continue
    }
    await client.patch(state._id).set({ pressKit }).commit()
    console.log(`  ✓ patched ${state._id} (${Object.keys(pressKit).join(' + ')})`)
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
