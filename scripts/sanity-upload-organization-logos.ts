/**
 * Convert partner logo source files and attach them to their `organization`
 * documents, so the homepage partner strip has something to render.
 *
 * PDF sources are rasterised with Ghostscript (`pngalpha`, 600 dpi) because the
 * supplied files are vector with no transparent PNG or SVG equivalent; every
 * source is then trimmed to its ink and capped at 1200px on the long edge.
 *
 * Idempotent: re-running re-uploads the asset and re-patches the same seven
 * documents. It never creates an organization — all seven already exist.
 *
 * Usage:
 *   pnpm exec tsx scripts/sanity-upload-organization-logos.ts --dry
 *   pnpm exec tsx scripts/sanity-upload-organization-logos.ts
 */

import { execFileSync } from 'node:child_process'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { createClient } from '@sanity/client'
import sharp from 'sharp'

if (typeof process.loadEnvFile === 'function') {
  try {
    process.loadEnvFile('.env.local')
  } catch {
    // .env.local is optional
  }
}

const dryRun = process.argv.includes('--dry')

const MAX_EDGE = 1200

interface LogoSource {
  orgId: string
  /** Path relative to the repo root. */
  file: string
  alt: string
}

const SOURCES: LogoSource[] = [
  {
    orgId: 'org-uapr',
    file: 'Copy of sigla UAP.pdf',
    alt: 'Uniunea Artiștilor Plastici din România',
  },
  {
    orgId: 'org-institutul-francez-din-romania',
    file: 'IF_Logo_Pays_AvecD_BLACK.pdf',
    alt: 'Institut Français Roumanie',
  },
  {
    orgId: 'org-liszt-institute',
    file: 'logo_RGB_bukarest_hu_inv.pdf',
    alt: 'Liszt Intézet Bukarest',
  },
  { orgId: 'org-unarte', file: 'Logo-UNArte.png', alt: 'UNArte' },
  {
    orgId: 'org-romanian-cultural-institute',
    file: 'sigla-en-albastru-icr-20.png',
    alt: 'Romanian Cultural Institute',
  },
  { orgId: 'org-monument-for', file: 'logo_monument_for@2x-8.png', alt: 'Monument for Public' },
  { orgId: 'org-short-film-breaks', file: 'Artboard 1 copy 3.png', alt: 'Short Film Breaks' },
]

function rasterise(pdfPath: string, outPath: string) {
  execFileSync('gs', [
    '-q',
    '-dNOPAUSE',
    '-dBATCH',
    '-dFirstPage=1',
    '-dLastPage=1',
    '-sDEVICE=pngalpha',
    '-r600',
    '-dTextAlphaBits=4',
    '-dGraphicsAlphaBits=4',
    `-o${outPath}`,
    pdfPath,
  ])
}

async function toLogoPng(source: LogoSource, workDir: string): Promise<Buffer> {
  const abs = resolve(process.cwd(), source.file)
  const input = abs.toLowerCase().endsWith('.pdf') ? join(workDir, `${source.orgId}.png`) : abs
  if (input !== abs) rasterise(abs, input)
  return sharp(input)
    .trim({ threshold: 1 })
    .resize({ width: MAX_EDGE, height: MAX_EDGE, fit: 'inside', withoutEnlargement: true })
    .png({ compressionLevel: 9, palette: true })
    .toBuffer()
}

async function main() {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
  const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION
  const token = process.env.SANITY_API_WRITE_TOKEN

  if (!projectId || !dataset || !apiVersion || (!dryRun && !token)) {
    throw new Error(
      'Missing env vars: NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, NEXT_PUBLIC_SANITY_API_VERSION, SANITY_API_WRITE_TOKEN',
    )
  }

  const client = createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: false,
    ...(token ? { token } : {}),
  })
  const workDir = mkdtempSync(join(tmpdir(), 'zsb-logos-'))

  try {
    const existing: { _id: string }[] = await client.fetch(
      '*[_type == "organization" && _id in $ids]{ _id }',
      { ids: SOURCES.map((source) => source.orgId) },
    )
    const known = new Set(existing.map((doc) => doc._id))
    const missing = SOURCES.filter((source) => !known.has(source.orgId))
    if (missing.length > 0) {
      throw new Error(`Unknown organization ids: ${missing.map((s) => s.orgId).join(', ')}`)
    }

    for (const source of SOURCES) {
      const buffer = await toLogoPng(source, workDir)
      const { width, height } = await sharp(buffer).metadata()
      const size = `${width}x${height}, ${(buffer.byteLength / 1024).toFixed(1)} KB`

      if (dryRun) {
        process.stdout.write(`[dry] ${source.orgId} ← ${source.file} (${size})\n`)
        continue
      }

      const asset = await client.assets.upload('image', buffer, {
        filename: `${source.orgId}.png`,
      })
      await client
        .patch(source.orgId)
        .set({
          logo: {
            _type: 'image',
            asset: { _type: 'reference', _ref: asset._id },
            alt: source.alt,
          },
        })
        .commit()
      process.stdout.write(`${source.orgId} ← ${source.file} (${size})\n`)
    }
  } finally {
    rmSync(workDir, { recursive: true, force: true })
  }
}

main().catch((error: unknown) => {
  console.error(error)
  process.exitCode = 1
})
