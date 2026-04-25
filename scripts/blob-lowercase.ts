/**
 * Rename every blob with uppercase characters in its pathname
 * to its lowercase equivalent. Idempotent — safe to re-run.
 *
 * Usage:
 *   BLOB_READ_WRITE_TOKEN=... pnpm exec tsx scripts/blob-lowercase.ts
 *   BLOB_READ_WRITE_TOKEN=... pnpm exec tsx scripts/blob-lowercase.ts --dry
 */

import { copy, del, list } from '@vercel/blob'

try {
  process.loadEnvFile('.env.local')
} catch {
  // .env.local is optional
}

const dryRun = process.argv.includes('--dry')

async function main() {
  const token = process.env.BLOB_READ_WRITE_TOKEN
  if (!token) throw new Error('BLOB_READ_WRITE_TOKEN is required')

  let cursor: string | undefined
  const work: { from: { pathname: string; url: string }; toPathname: string }[] = []

  const normalize = (s: string) =>
    s.toLowerCase().replaceAll(' ', '_').replace(/\.jpeg$/, '.jpg')

  do {
    const result = await list(cursor ? { token, cursor, limit: 1000 } : { token, limit: 1000 })
    for (const blob of result.blobs) {
      const target = normalize(blob.pathname)
      if (blob.pathname !== target) {
        work.push({
          from: { pathname: blob.pathname, url: blob.url },
          toPathname: target,
        })
      }
    }
    cursor = result.cursor
  } while (cursor)

  if (work.length === 0) {
    console.log('Nothing to rename — all blob pathnames are already lowercase.')
    return
  }

  console.log(`${dryRun ? '[dry run] ' : ''}Renaming ${work.length} blobs:`)
  for (const { from, toPathname } of work) {
    console.log(`  ${from.pathname}  →  ${toPathname}`)
  }

  if (dryRun) return

  let done = 0
  for (const { from, toPathname } of work) {
    // Copy to lowercase pathname, then delete the uppercase original.
    await copy(from.url, toPathname, {
      access: 'public',
      token,
      addRandomSuffix: false,
    })
    await del(from.url, { token })
    done++
    if (done % 10 === 0) console.log(`  ... ${done}/${work.length}`)
  }
  console.log(`Done — renamed ${done} blobs.`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
