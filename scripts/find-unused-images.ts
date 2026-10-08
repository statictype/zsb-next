/** Usage: pnpm images:unused [--json] [--delete [--confirm]]. --delete without --confirm is a dry run. */

import { readdirSync, readFileSync, statSync, unlinkSync } from 'fs'
import { dirname, extname, join, relative } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const ROOT = join(__dirname, '..')
const PUBLIC_IMG = join(ROOT, 'public/img')
const SRC_DIRS = [join(ROOT, 'src'), join(ROOT, 'public')]

const IMAGE_EXTS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif', '.svg', '.tiff'])
const SOURCE_EXTS = new Set(['.ts', '.tsx', '.js', '.jsx', '.css', '.json', '.html', '.md'])

const RESPONSIVE_SUFFIX =
  /^(.+)-(300|320|400|480|600|768|800|960|1024|1200|1280|1440|1600|1700|1920|2048|2560)\.(jpg|jpeg|png|webp|gif|avif)$/i

interface ImageFile {
  absPath: string
  urlPath: string
  basePath: string
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
    const basePath = urlPath.replace(/\.[^.]+$/, '')
    return { absPath, urlPath, basePath, isResponsive: false }
  })
}

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
      if (file.startsWith(PUBLIC_IMG)) continue

      const content = readFileSync(file, 'utf-8')
      let m: RegExpExecArray | null
      IMG_PATTERN.lastIndex = 0
      while ((m = IMG_PATTERN.exec(content)) !== null) {
        const ref = m[0].replace(/[?#].*$/, '').replace(/[.,;:!]+$/, '')
        refs.add(ref)
        const noExt = ref.replace(/\.[^./]+$/, '')
        if (noExt !== ref) refs.add(noExt)
      }
    }
  }

  return refs
}

function isUsed(img: ImageFile, refs: Set<string>): boolean {
  if (refs.has(img.urlPath)) return true
  if (refs.has(img.basePath)) return true
  if (!img.isResponsive) {
    const withoutExt = img.urlPath.replace(/\.[^.]+$/, '')
    if (refs.has(withoutExt)) return true
  }
  return false
}

interface UnusedGroup {
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
  return [...groups.values()].sort((a, b) => a.basePath.localeCompare(b.basePath))
}

function fmtBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`
}

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
