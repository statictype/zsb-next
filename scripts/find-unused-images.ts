/**
 * Find unused images in public/img/ by scanning all source files for references.
 *
 * Usage:
 *   npx tsx scripts/find-unused-images.ts
 *   npx tsx scripts/find-unused-images.ts --json     # output as JSON
 *   npx tsx scripts/find-unused-images.ts --delete   # delete unused files (dry-run by default)
 *   npx tsx scripts/find-unused-images.ts --delete --confirm  # actually delete
 *
 * How it works:
 *   1. Collect every image file under public/img/
 *   2. For responsive images (e.g. foo-1200.webp), derive the basePath (foo)
 *   3. Scan all source files (.ts .tsx .css .json) for /img/... references
 *   4. A file is "used" if its basePath (or full path) appears anywhere in source
 *   5. Report unused files, grouped by basePath for responsive sets
 */

import { readdirSync, readFileSync, statSync, unlinkSync } from 'fs'
import { dirname, extname, join, relative } from 'path'
import { fileURLToPath } from 'url'

// Resolve __dirname for both ESM and CJS contexts
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const ROOT = join(__dirname, '..')
const PUBLIC_IMG = join(ROOT, 'public/img')
const SRC_DIRS = [join(ROOT, 'src'), join(ROOT, 'public')] // also scan public for HTML/JSON

const IMAGE_EXTS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif', '.svg', '.tiff'])
const SOURCE_EXTS = new Set(['.ts', '.tsx', '.js', '.jsx', '.css', '.json', '.html', '.md'])

// Regex to detect responsive width suffix: only matches known responsive widths
// (avoids false matches on files like tile-1.png, poster-zsb-2022.jpg, DSF0201.jpg)
const RESPONSIVE_SUFFIX = /^(.+)-(300|320|400|480|600|768|800|960|1024|1200|1280|1440|1600|1700|1920|2048|2560)\.(jpg|jpeg|png|webp|gif|avif)$/i

// ---------------------------------------------------------------------------
// Step 1: collect all image files
// ---------------------------------------------------------------------------

interface ImageFile {
  /** Absolute path on disk */
  absPath: string
  /** URL path as used in code: /img/2025/optimized/foo-1200.webp */
  urlPath: string
  /** For responsive images: /img/2025/optimized/foo — otherwise same as urlPath minus ext */
  basePath: string
  /** True if the file name contains a responsive width suffix */
  isResponsive: boolean
}

function walkDir(dir: string, exts: Set<string>): string[] {
  const results: string[] = []
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    const stat = statSync(full)
    if (stat.isDirectory()) {
      results.push(...walkDir(full, exts))
    } else if (exts.has(extname(entry).toLowerCase())) {
      results.push(full)
    }
  }
  return results
}

function collectImageFiles(): ImageFile[] {
  const files = walkDir(PUBLIC_IMG, IMAGE_EXTS)
  return files.map((absPath) => {
    const rel = '/' + relative(join(ROOT, 'public'), absPath)
    const urlPath = rel.replace(/\\/g, '/')

    const match = RESPONSIVE_SUFFIX.exec(urlPath)
    if (match) {
      return {
        absPath,
        urlPath,
        basePath: match[1] as string,
        isResponsive: true,
      }
    }
    // Non-responsive: strip extension for basePath so we can also catch
    // references like /img/partners/UAPR (without .png)
    const basePath = urlPath.replace(/\.[^.]+$/, '')
    return { absPath, urlPath, basePath, isResponsive: false }
  })
}

// ---------------------------------------------------------------------------
// Step 2: collect all source file contents and extract /img/ mentions
// ---------------------------------------------------------------------------

function collectSourceRefs(): Set<string> {
  const refs = new Set<string>()
  const IMG_PATTERN = /\/img\/[^\s"'`)\]>]+/g

  for (const srcDir of SRC_DIRS) {
    let sourceFiles: string[]
    try {
      sourceFiles = walkDir(srcDir, SOURCE_EXTS)
    } catch {
      continue
    }

    for (const file of sourceFiles) {
      // Skip the image files themselves (don't count a file as its own reference)
      if (file.startsWith(PUBLIC_IMG)) continue

      const content = readFileSync(file, 'utf-8')
      let m: RegExpExecArray | null
      IMG_PATTERN.lastIndex = 0
      while ((m = IMG_PATTERN.exec(content)) !== null) {
        // Strip query params and trailing punctuation
        const ref = m[0].replace(/[?#].*$/, '').replace(/[.,;:!]+$/, '')
        refs.add(ref)
        // Also add without extension, in case file is referenced both ways
        const noExt = ref.replace(/\.[^./]+$/, '')
        if (noExt !== ref) refs.add(noExt)
      }
    }
  }

  return refs
}

// ---------------------------------------------------------------------------
// Step 3: determine which files are unused
// ---------------------------------------------------------------------------

function isUsed(img: ImageFile, refs: Set<string>): boolean {
  // Direct match of full URL path
  if (refs.has(img.urlPath)) return true
  // Match by basePath (handles both responsive and direct-without-ext references)
  if (refs.has(img.basePath)) return true
  // For non-responsive files: also check if the full path without ext matches
  if (!img.isResponsive) {
    const withoutExt = img.urlPath.replace(/\.[^.]+$/, '')
    if (refs.has(withoutExt)) return true
  }
  return false
}

// ---------------------------------------------------------------------------
// Step 4: group & report
// ---------------------------------------------------------------------------

interface UnusedGroup {
  /** The basePath shared by all variants, e.g. /img/2025/optimized/foo */
  basePath: string
  files: string[]
  totalBytes: number
}

function groupUnused(unused: ImageFile[]): UnusedGroup[] {
  const groups = new Map<string, UnusedGroup>()
  for (const img of unused) {
    const key = img.basePath
    if (!groups.has(key)) {
      groups.set(key, { basePath: key, files: [], totalBytes: 0 })
    }
    const group = groups.get(key)!
    group.files.push(img.urlPath)
    group.totalBytes += statSync(img.absPath).size
  }
  // Sort by basePath for readability
  return [...groups.values()].sort((a, b) => a.basePath.localeCompare(b.basePath))
}

function fmtBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

const args = process.argv.slice(2)
const outputJson = args.includes('--json')
const doDelete = args.includes('--delete')
const confirmed = args.includes('--confirm')

console.error('Scanning images...')
const allImages = collectImageFiles()
console.error(`Found ${allImages.length} image files`)

console.error('Scanning source files...')
const refs = collectSourceRefs()
console.error(`Found ${refs.size} unique /img/ references in source`)

const unusedImages = allImages.filter((img) => !isUsed(img, refs))
const groups = groupUnused(unusedImages)

const totalBytes = unusedImages.reduce((sum, img) => sum + statSync(img.absPath).size, 0)
const usedCount = allImages.length - unusedImages.length

if (outputJson) {
  console.log(
    JSON.stringify(
      {
        summary: {
          total: allImages.length,
          used: usedCount,
          unused: unusedImages.length,
          unusedGroups: groups.length,
          unusedSize: totalBytes,
          unusedSizeHuman: fmtBytes(totalBytes),
        },
        unusedGroups: groups,
      },
      null,
      2,
    ),
  )
} else {
  console.log(`\n${'='.repeat(60)}`)
  console.log(`Image usage report`)
  console.log(`${'='.repeat(60)}`)
  console.log(`Total image files : ${allImages.length}`)
  console.log(`Used              : ${usedCount}`)
  console.log(`Unused            : ${unusedImages.length} files in ${groups.length} groups`)
  console.log(`Reclaimable space : ${fmtBytes(totalBytes)}`)
  console.log()

  if (groups.length === 0) {
    console.log('No unused images found.')
  } else {
    for (const group of groups) {
      const groupSize = fmtBytes(group.totalBytes)
      console.log(`  ${group.basePath}  [${groupSize}]`)
      for (const f of group.files) {
        console.log(`    ${f}`)
      }
    }
  }

  console.log()
}

if (doDelete && unusedImages.length > 0) {
  if (!confirmed) {
    console.log(`Dry run — ${unusedImages.length} files would be deleted.`)
    console.log('Run with --delete --confirm to actually delete them.')
  } else {
    console.log(`Deleting ${unusedImages.length} files...`)
    let deleted = 0
    for (const img of unusedImages) {
      try {
        unlinkSync(img.absPath)
        deleted++
      } catch (e) {
        console.error(`  Failed to delete ${img.urlPath}: ${e}`)
      }
    }
    console.log(`Deleted ${deleted} files, freed ~${fmtBytes(totalBytes)}`)
  }
}
