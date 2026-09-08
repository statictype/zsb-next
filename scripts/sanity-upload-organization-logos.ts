/**
 * Convert partner logo source files and attach them to their `organization`
 * documents, so the homepage partner strip has something to render.
 *
 * PDF and Illustrator sources are rasterised with Ghostscript (`pngalpha`,
 * 600 dpi) because the supplied files are vector with no transparent PNG or SVG
 * equivalent; flat sources that ship on a white ground are keyed to
 * transparency. Every source is then trimmed to its ink and capped at 1200px on
 * the long edge.
 *
 * Idempotent: re-running re-uploads the asset and re-patches the same
 * documents. It never creates an organization — all of them already exist.
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
const WHITE_FLOOR = 205
const WHITE_CEIL = 248

const SOURCE_ROOT = '../content v2/partner logos'

interface LogoSource {
  orgId: string
  /** Path relative to `root`, or to `SOURCE_ROOT` when that is omitted. */
  file: string
  alt: string
  root?: string
  /** Source is flat artwork on a white ground; key that ground to alpha. */
  keyWhite?: boolean
  /** Source is a white-ink variant; invert it for the light credits ground. */
  invert?: boolean
}

const SOURCES: LogoSource[] = [
  {
    orgId: 'org-municipality-of-bucharest',
    file: 'Logouri noi/primaria-capitalei.png',
    alt: 'Primăria Capitalei',
  },
  { orgId: 'org-arche', file: 'Logouri parteneri 2024/Logo_Arche.ai', alt: 'Arché' },
  {
    orgId: 'org-visual-arts-forum-association',
    file: 'Logouri parteneri 2024/FAV_logo_d1(3).pdf',
    alt: 'Forumul Artelor Vizuale',
  },
  {
    orgId: 'org-galeria-senat',
    file: 'LOGO Parteneri 2025/Parteneri/Galeria SENAT/logo senat.ai',
    alt: 'Senat',
  },
  {
    orgId: 'org-combinat-ro',
    file: 'LOGO Parteneri 2025/Parteneri/Combinat.ro-The institute/Logo_Combinat_2022_landscape_B.ai',
    alt: 'Combinat',
  },
  {
    orgId: 'org-the-institute',
    file: 'LOGO Parteneri 2025/Parteneri/Combinat.ro-The institute/The_Institute_logo.ai',
    alt: 'The Institute',
  },
  {
    orgId: 'org-biographies-of-artist-couples',
    file: 'Logouri parteneri 2024/Intersections_Logo.pdf',
    alt: 'Biografia cuplurilor de artiști',
  },
  {
    orgId: 'org-international-sculpture-day-isday',
    file: 'img/partners/ISDay_Branding.jpg',
    root: '../website',
    alt: '#ISDay — International Sculpture Day',
    keyWhite: true,
  },
  { orgId: 'org-sl-jazzing', file: 'Logouri parteneri 2024/Black.png', alt: 'SL-Jazzing' },
  {
    orgId: 'org-compas-coffee',
    file: 'Logouri noi/compass-coffee.png',
    alt: 'Compas Coffee',
    keyWhite: true,
  },
  {
    orgId: 'org-tonitza-high-school',
    file: 'Logouri noi/logo-tonitza.png',
    alt: 'Liceul de Arte Plastice Nicolae Tonitza',
    keyWhite: true,
  },
  {
    orgId: 'org-paciurea-high-school',
    file: 'Logouri noi/id_paciurea_web.png',
    alt: 'Liceul de Arte Plastice Dimitrie Paciurea',
    invert: true,
  },
  {
    orgId: 'org-buna-foundation-bg',
    file: 'Logouri parteneri 2024/03.png',
    alt: 'BUNA / Forum for Contemporary Art',
  },
  {
    orgId: 'org-national-institute-of-heritage',
    file: 'Logouri parteneri 2024/patrimoniu@2x.png',
    alt: 'Institutul Național al Patrimoniului',
  },
  { orgId: 'org-doi-joi', file: 'Logouri parteneri 2024/doijoi-blue (1).png', alt: 'doi joi' },
  {
    orgId: 'org-combinatul-fondului-plastic',
    file: 'Logo Parteneri 2022/logo-cfp.jpg',
    alt: 'Combinatul Fondului Plastic',
    keyWhite: true,
  },
  {
    orgId: 'org-cramele-recas',
    file: 'Logouri parteneri 2024/IMG_2806.WEBP',
    alt: 'Cramele Recaș',
    keyWhite: true,
  },
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

async function keyWhiteToAlpha(input: string): Promise<Buffer> {
  const { data, info } = await sharp(input)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })
  for (let i = 0; i < data.length; i += 4) {
    const luma = 0.2126 * (data[i] ?? 0) + 0.7152 * (data[i + 1] ?? 0) + 0.0722 * (data[i + 2] ?? 0)
    const keyed =
      luma >= WHITE_CEIL
        ? 0
        : luma <= WHITE_FLOOR
          ? 255
          : Math.round((255 * (WHITE_CEIL - luma)) / (WHITE_CEIL - WHITE_FLOOR))
    data[i + 3] = Math.min(data[i + 3] ?? 255, keyed)
  }
  return sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } })
    .png()
    .toBuffer()
}

async function toLogoPng(source: LogoSource, workDir: string): Promise<Buffer> {
  const abs = resolve(process.cwd(), source.root ?? SOURCE_ROOT, source.file)
  const vector = /\.(pdf|ai)$/i.test(abs)
  const input = vector ? join(workDir, `${source.orgId}.png`) : abs
  if (vector) rasterise(abs, input)
  const pipeline = sharp(source.keyWhite ? await keyWhiteToAlpha(input) : input)
  if (source.invert) pipeline.negate({ alpha: false })
  return pipeline
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
