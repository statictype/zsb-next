/**
 * Upload local images to Vercel Blob.
 *
 * Normalizes target pathnames to lowercase (matching blob-lowercase.ts) and
 * resizes anything over MAX_DIMENSION on the longest edge (matching
 * blob-resize.ts). Year is auto-detected from the source path
 * (e.g. .../zsb2024/foo.jpg or .../2023/faves/foo.jpg) or can be forced
 * with --year YYYY.
 *
 * Usage:
 *   pnpm exec tsx scripts/blob-upload.ts <file>...
 *   pnpm exec tsx scripts/blob-upload.ts --year 2025 <file>...
 *   pnpm exec tsx scripts/blob-upload.ts --dry <file>...
 */

import { readFile } from 'node:fs/promises'
import { basename } from 'node:path'
import { put } from '@vercel/blob'
import sharp from 'sharp'

try {
  process.loadEnvFile('.env.local')
} catch {
  // .env.local is optional
}

const MAX_DIMENSION = 3840
const JPEG_QUALITY = 80

function parseArgs(argv: string[]): { dry: boolean; year: string | null; files: string[] } {
  const args = argv.slice(2)
  let dry = false
  let year: string | null = null
  const files: string[] = []
  while (args.length > 0) {
    const a = args.shift()!
    if (a === '--dry') {
      dry = true
    } else if (a === '--year') {
      const next = args.shift()
      if (next) year = next
    } else {
      files.push(a)
    }
  }
  return { dry, year, files }
}

function detectYear(path: string): string | null {
  // Year not preceded by a digit, followed by a path/name separator. Matches
  // `/2023/...`, `zsb2024/...`, `_2025_...`. Picks the rightmost occurrence.
  const matches = path.match(/(?<!\d)(20\d{2})(?=[/_.])/g)
  return matches && matches.length > 0 ? matches[matches.length - 1]! : null
}

function normalizeName(name: string): string {
  return name.toLowerCase().replaceAll(' ', '_').replace(/\.jpeg$/, '.jpg')
}

function fmtKB(n: number): string {
  return `${(n / 1024).toFixed(0)} KB`
}

async function main() {
  const { dry, year: yearOverride, files } = parseArgs(process.argv)
  if (files.length === 0) {
    console.error('Usage: pnpm exec tsx scripts/blob-upload.ts [--dry] [--year YYYY] <file>...')
    process.exit(1)
  }

  const token = process.env.BLOB_READ_WRITE_TOKEN
  if (!token) throw new Error('BLOB_READ_WRITE_TOKEN is required')

  for (const src of files) {
    const year = yearOverride ?? detectYear(src)
    if (!year) {
      console.error(`skip  ${src}  — could not detect year (pass --year YYYY)`)
      continue
    }
    const target = `${year}/${normalizeName(basename(src))}`

    const raw = await readFile(src)
    const img = sharp(raw, { failOn: 'none' }).rotate()
    const meta = await img.metadata()
    const longest = Math.max(meta.width ?? 0, meta.height ?? 0)
    const buffer =
      longest > MAX_DIMENSION
        ? await img
            .resize({
              width: MAX_DIMENSION,
              height: MAX_DIMENSION,
              fit: 'inside',
              withoutEnlargement: true,
            })
            .jpeg({ quality: JPEG_QUALITY, mozjpeg: true })
            .toBuffer()
        : raw

    if (dry) {
      console.log(
        `[dry] ${target.padEnd(40)} ${meta.width}x${meta.height}  ${fmtKB(buffer.length)}`,
      )
      continue
    }

    await put(target, buffer, {
      access: 'public',
      token,
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: 'image/jpeg',
    })
    console.log(`ok    ${target.padEnd(40)} ${meta.width}x${meta.height}  ${fmtKB(buffer.length)}`)
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
