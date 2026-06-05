/**
 * Generates the PWA / Apple touch icons from the canonical monogram in
 * `src/app/icon.svg` (the favicon source). Single source of truth: if the logo
 * changes, re-run this script rather than hand-editing the PNGs.
 *
 *   pnpm exec tsx scripts/generate-app-icons.ts
 *
 * Output (committed):
 *   - src/app/apple-icon.png   180×180  Apple touch icon (Next file convention)
 *   - public/icon-192.png      192×192  PWA manifest icon
 *   - public/icon-512.png      512×512  PWA manifest icon
 *
 * Treatment: the pink monogram trimmed to its ink bounds and optically centered
 * on the brand canvas (#0e0b10) with even padding — matching the "dark tile,
 * pink mark" identity (favicon + default OG card). The full-bleed dark
 * background also satisfies the maskable safe-zone, so the manifest icons are
 * declared `purpose: "any maskable"`.
 */
import { readFile } from 'node:fs/promises'
import sharp from 'sharp'

const CANVAS = '#0e0b10'
const MARK = '#ec008c'
const PAD_RATIO = 0.3 // total padding; ~15% inset each side (within maskable safe zone)

async function markSvg(): Promise<Buffer> {
  const raw = await readFile(new URL('../src/app/icon.svg', import.meta.url), 'utf8')
  return Buffer.from(raw.replace(/fill="#[0-9a-fA-F]{3,8}"/g, `fill="${MARK}"`))
}

async function generate(svg: Buffer, size: number, out: URL) {
  const inner = Math.round(size * (1 - PAD_RATIO))
  const mark = await sharp(svg, { density: 512 })
    .trim()
    .resize(inner, inner, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer()
  await sharp({ create: { width: size, height: size, channels: 4, background: CANVAS } })
    .composite([{ input: mark, gravity: 'center' }])
    .png()
    .toFile(out.pathname)
  console.log('wrote', out.pathname)
}

async function main() {
  const svg = await markSvg()
  await generate(svg, 180, new URL('../src/app/apple-icon.png', import.meta.url))
  await generate(svg, 192, new URL('../public/icon-192.png', import.meta.url))
  await generate(svg, 512, new URL('../public/icon-512.png', import.meta.url))
}

void main()
