import 'server-only'

import { readFile } from 'node:fs/promises'

// Shared infrastructure for the generated Open Graph cards (next/og). Assets
// are referenced via `new URL(..., import.meta.url)` rather than
// `process.cwd()` so Turbopack's file tracing copies exactly these files into
// the bundle (a bare fs path traces the whole project and forces the routes
// dynamic).

export const OG_SIZE = { width: 1200, height: 630 } as const
export const OG_CONTENT_TYPE = 'image/png'

// Brand palette — mirrors the role tokens in src/app/globals.css.
export const BRAND = {
  canvas: '#0e0b10',
  pink: '#ec008c',
  chartreuse: '#d4e50a',
  heading: '#ffffff',
  muted: '#9e9a9c',
} as const

/**
 * Fold Romanian (and any) diacritics to ASCII for the OG cards. The embedded
 * fonts are basic-Latin subsets, so a glyph like `ă` would otherwise trigger
 * next/og's dynamic Google-font fetch — which rejects during prerender under
 * `cacheComponents` (HANGING_PROMISE_REJECTION). Cards are share images, so
 * `Grădina` → `Gradina` is an acceptable trade for a clean, self-contained build.
 */
export function asciiFold(text: string): string {
  // NFD splits accented letters into base + combining mark; drop the marks.
  return text.normalize('NFD').replace(/[̀-ͯ]/g, '')
}

/**
 * The site's two typefaces as ImageResponse font descriptors. Dela Gothic One
 * (display) is listed first; Montserrat (weights 600/700) covers body text.
 * Both are basic-Latin subsets — fold copy through `asciiFold` before rendering.
 */
export async function loadOgFonts() {
  const [dela, montserrat600, montserrat700] = await Promise.all([
    readFile(new URL('../../assets/fonts/DelaGothicOne-400.ttf', import.meta.url)),
    readFile(new URL('../../assets/fonts/Montserrat-600.ttf', import.meta.url)),
    readFile(new URL('../../assets/fonts/Montserrat-700.ttf', import.meta.url)),
  ])
  return [
    { name: 'Dela Gothic One', data: dela, weight: 400 as const, style: 'normal' as const },
    { name: 'Montserrat', data: montserrat600, weight: 600 as const, style: 'normal' as const },
    { name: 'Montserrat', data: montserrat700, weight: 700 as const, style: 'normal' as const },
  ]
}

/**
 * The ZSB monogram as a data-URI SVG for use as an `<img src>` inside an
 * ImageResponse. Pass a hex `color` to recolor every fill (e.g. white over a
 * photo); omit it to keep the brand pink for the dark default card.
 */
export async function loadOgLogo(color?: string): Promise<string> {
  let svg = await readFile(new URL('../app/icon.svg', import.meta.url), 'utf8')
  if (color) svg = svg.replace(/fill="#[0-9a-fA-F]{3,8}"/g, `fill="${color}"`)
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`
}
