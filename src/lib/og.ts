import 'server-only'

import { readFile } from 'node:fs/promises'

// Assets use `new URL(..., import.meta.url)` so Turbopack file tracing bundles only
// these files; a bare fs path traces the whole project and forces the routes dynamic.

export const OG_SIZE = { width: 1200, height: 630 } as const
export const OG_CONTENT_TYPE = 'image/png'

export function ogImageSrc(src: string): string {
  const url = new URL(src)
  url.searchParams.set('w', String(OG_SIZE.width))
  url.searchParams.set('h', String(OG_SIZE.height))
  url.searchParams.set('fit', 'crop')
  return url.toString()
}

// Mirrors the role tokens in src/app/globals.css.
export const BRAND = {
  canvas: '#0e0b10',
  pink: '#ec008c',
  green: '#009a55',
  heading: '#ffffff',
  muted: '#9e9a9c',
} as const

export async function loadOgFonts() {
  const [dela, montserrat600, montserrat700] = await Promise.all([
    readFile(new URL('../../assets/fonts/DelaGothicOne.ttf', import.meta.url)),
    readFile(new URL('../../assets/fonts/Montserrat-600.ttf', import.meta.url)),
    readFile(new URL('../../assets/fonts/Montserrat-700.ttf', import.meta.url)),
  ])
  return [
    { name: 'Dela Gothic One', data: dela, weight: 400 as const, style: 'normal' as const },
    { name: 'Montserrat', data: montserrat600, weight: 600 as const, style: 'normal' as const },
    { name: 'Montserrat', data: montserrat700, weight: 700 as const, style: 'normal' as const },
  ]
}

// `color` recolors every fill in the SVG.
export async function loadOgLogo(color?: string): Promise<string> {
  let svg = await readFile(new URL('../app/icon.svg', import.meta.url), 'utf8')
  if (color) svg = svg.replace(/fill="#[0-9a-fA-F]{3,8}"/g, `fill="${color}"`)
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`
}
