/**
 * Collapse the five legacy carousel slide types into the unified
 * `carouselSlide` (ADR 0010, Step 6 #1).
 *
 * For every `edition.carousel[]` item whose `_type` is one of the legacy
 * `slide*` types, set `layout` (derived from `_type`) and rename `_type` to
 * `carouselSlide`. `images` is left untouched.
 *
 * Run order: AFTER the expand commit is deployed (the query/mapper already
 * dual-read `layout`, so reachable editions render correctly before, during,
 * and after this patch). Frontend has no downtime.
 *
 * Idempotent: only targets items still on a legacy `_type`; already-migrated
 * `carouselSlide` items are skipped, so re-runs are no-ops.
 * Uses the `raw` perspective so published docs and any `drafts.` versions are
 * both caught.
 *
 * Usage:
 *   pnpm exec tsx scripts/sanity-migrate-carousel-slide.ts        # apply
 *   pnpm exec tsx scripts/sanity-migrate-carousel-slide.ts --dry  # preview
 */

import '@scripts/_load-env'

import { createClient } from '@sanity/client'

const SLIDE_LAYOUTS: Record<string, string> = {
  slideFull: 'full',
  slideDuo: 'duo',
  slideFeaturedPortrait: 'featured-portrait',
  slideTrio: 'trio',
  slideFeaturedStack: 'featured-stack',
}
const LEGACY = Object.keys(SLIDE_LAYOUTS)

interface Slide {
  _key: string
  _type: string
}
interface EditionDoc {
  _id: string
  year?: number
  carousel?: Slide[]
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
  const client = createClient({
    projectId,
    dataset,
    apiVersion,
    token,
    useCdn: false,
    perspective: 'raw',
  })

  const targets = await client.fetch<EditionDoc[]>(
    `*[_type == "edition" && count(carousel[_type in $legacy]) > 0]{
      _id, year, carousel[]{ _key, _type }
    }`,
    { legacy: LEGACY },
  )

  const editsByDoc = targets.map((e) => ({
    doc: e,
    slides: (e.carousel ?? []).filter((s) => SLIDE_LAYOUTS[s._type]),
  }))
  const totalSlides = editsByDoc.reduce((n, e) => n + e.slides.length, 0)

  console.log(
    `${targets.length} edition document(s) with ${totalSlides} legacy slide(s) to migrate.`,
  )
  if (!totalSlides) {
    console.log('Nothing to migrate.')
    return
  }

  if (dryRun) {
    for (const { doc, slides } of editsByDoc) {
      console.log(`  ZSB ${doc.year ?? '?'}  [${doc._id}]`)
      for (const s of slides) {
        console.log(`    ${s._type}  →  carouselSlide (layout: ${SLIDE_LAYOUTS[s._type]})`)
      }
    }
    console.log(`\n(dry run — no writes. ${totalSlides} slide(s) across ${targets.length} doc(s).)`)
    return
  }

  let tx = client.transaction()
  for (const { doc, slides } of editsByDoc) {
    for (const s of slides) {
      const layout = SLIDE_LAYOUTS[s._type]
      tx = tx.patch(doc._id, (p) =>
        p.set({
          [`carousel[_key=="${s._key}"].layout`]: layout,
          [`carousel[_key=="${s._key}"]._type`]: 'carouselSlide',
        }),
      )
    }
  }
  await tx.commit()
  console.log(`✓ Migrated ${totalSlides} slide(s) across ${targets.length} edition document(s).`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
