/**
 * Breakpoints — 256px grid
 *
 * These match the @media breakpoints in globals.css.
 * Use for JS/TS logic (matchMedia, resize observers, etc.).
 *
 * In CSS, use the raw values directly — custom properties
 * cannot be used inside @media min-width queries.
 */

export const BP = {
  sm: 768, // 256 * 3
  md: 1024, // 256 * 4
  lg: 1280, // 256 * 5
  xl2: 1440, // intermediate — MacBook Pro 14"
  xl: 1536, // 256 * 6
  '2xl': 1792, // 256 * 7
} as const

export type Breakpoint = keyof typeof BP

/** Returns a min-width media query string for use with matchMedia. */
export function mq(bp: Breakpoint): string {
  return `(min-width: ${BP[bp]}px)`
}
