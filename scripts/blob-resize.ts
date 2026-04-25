/**
 * Resize oversized blobs in place.
 *
 * For each blob over SIZE_THRESHOLD or wider/taller than MAX_DIMENSION,
 * download, resize to fit within MAX_DIMENSION on the longest edge, and
 * upload back to the same pathname (overwriting). JPEG output at q=80,
 * PNG kept as PNG with max compression.
 *
 * Idempotent: re-running after a successful pass skips everything.
 *
 * Usage:
 *   pnpm exec tsx scripts/blob-resize.ts --dry
 *   pnpm exec tsx scripts/blob-resize.ts
 */

import { list, put } from '@vercel/blob'
import sharp from 'sharp'

try {
  process.loadEnvFile('.env.local')
} catch {}

const dryRun = process.argv.includes('--dry')

const MAX_DIMENSION = 3840
const JPEG_QUALITY = 80
const SIZE_THRESHOLD = 5 * 1024 * 1024 // 5 MB

function fmtBytes(n: number) {
  if (n < 1024) return `${n} B`
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(0)} KB`
  return `${(n / 1024 / 1024).toFixed(1)} MB`
}

async function main() {
  const token = process.env.BLOB_READ_WRITE_TOKEN
  if (!token) throw new Error('BLOB_READ_WRITE_TOKEN is required')

  const blobs: { pathname: string; url: string; size: number }[] = []
  let cursor: string | undefined
  do {
    const result = await list(cursor ? { token, cursor, limit: 1000 } : { token, limit: 1000 })
    for (const b of result.blobs) {
      blobs.push({ pathname: b.pathname, url: b.url, size: b.size })
    }
    cursor = result.cursor
  } while (cursor)

  console.log(`Scanning ${blobs.length} blobs...`)

  let processed = 0
  let skipped = 0
  let totalBefore = 0
  let totalAfter = 0

  for (const blob of blobs) {
    const isPng = blob.pathname.toLowerCase().endsWith('.png')
    const isJpeg = /\.(jpe?g)$/i.test(blob.pathname)
    if (!isPng && !isJpeg) {
      skipped++
      continue
    }

    if (blob.size < SIZE_THRESHOLD) {
      skipped++
      continue
    }

    // Download, inspect, resize
    const resp = await fetch(blob.url)
    if (!resp.ok) {
      console.error(`  fetch failed for ${blob.pathname}: ${resp.status}`)
      continue
    }
    const inputBuffer = Buffer.from(await resp.arrayBuffer())
    const image = sharp(inputBuffer, { failOn: 'none' }).rotate()
    const meta = await image.metadata()
    const longestEdge = Math.max(meta.width ?? 0, meta.height ?? 0)

    // If it's under size threshold AND dimensions are fine, skip (shouldn't happen
    // since we already gated on size, but defensive).
    if (longestEdge <= MAX_DIMENSION && inputBuffer.length < SIZE_THRESHOLD) {
      skipped++
      continue
    }

    const pipeline = image.resize({
      width: MAX_DIMENSION,
      height: MAX_DIMENSION,
      fit: 'inside',
      withoutEnlargement: true,
    })

    const output = isPng
      ? await pipeline.png({ compressionLevel: 9, palette: false }).toBuffer()
      : await pipeline.jpeg({ quality: JPEG_QUALITY, mozjpeg: true }).toBuffer()

    const before = inputBuffer.length
    const after = output.length

    if (after >= before) {
      console.log(
        `  ${blob.pathname.padEnd(45)} ${fmtBytes(before).padStart(8)} — skip (re-encode would grow to ${fmtBytes(after)})`,
      )
      skipped++
      continue
    }

    totalBefore += before
    totalAfter += after

    console.log(
      `  ${blob.pathname.padEnd(45)} ${fmtBytes(before).padStart(8)} → ${fmtBytes(after).padStart(8)}  (${meta.width}x${meta.height})`,
    )

    if (!dryRun) {
      await put(blob.pathname, output, {
        access: 'public',
        token,
        addRandomSuffix: false,
        allowOverwrite: true,
        contentType: isPng ? 'image/png' : 'image/jpeg',
      })
    }
    processed++
  }

  console.log()
  console.log(
    `${dryRun ? '[dry run] ' : ''}processed ${processed}, skipped ${skipped}, total ${fmtBytes(totalBefore)} → ${fmtBytes(totalAfter)} (saved ${fmtBytes(totalBefore - totalAfter)})`,
  )
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
