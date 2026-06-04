import { ImageResponse } from 'next/og'

// Default social-share card for every (site) route that doesn't set its own
// Open Graph image. Edition pages override this via `openGraph.images` in
// generateMetadata — and since a child segment's `openGraph` replaces the
// inherited one wholesale, their hero photo wins with no duplication.
// Scoped to (site) so /studio doesn't inherit it.

export const alt =
  'Bucharest Sculpture Days (ZSB) — Zilele Sculpturii București, a contemporary sculpture event in Bucharest, Romania.'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

// Brand tokens (src/app/globals.css): canvas, chartreuse highlight, pink action.
const CANVAS = '#0e0b10'
const CHARTREUSE = '#d4e50a'
const PINK = '#ec008c'
const HEADING = '#fff'
const MUTED = '#9e9a9c'

export default function Image() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        background: CANVAS,
        padding: 80,
        fontFamily: 'sans-serif',
      }}
    >
      <div style={{ display: 'flex', fontSize: 28, letterSpacing: 6, color: CHARTREUSE }}>
        ZSB · CONTEMPORARY SCULPTURE
      </div>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div
          style={{
            display: 'flex',
            fontSize: 112,
            fontWeight: 800,
            color: HEADING,
            lineHeight: 1.04,
            letterSpacing: -3,
          }}
        >
          Bucharest
        </div>
        <div
          style={{
            display: 'flex',
            fontSize: 112,
            fontWeight: 800,
            color: HEADING,
            lineHeight: 1.04,
            letterSpacing: -3,
          }}
        >
          Sculpture Days
        </div>
        <div style={{ display: 'flex', width: 220, height: 12, marginTop: 28, background: PINK }} />
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: 26,
          color: MUTED,
        }}
      >
        <div style={{ display: 'flex' }}>Bucharest, Romania · since 2021</div>
        <div style={{ display: 'flex', color: HEADING }}>sculpturedays.com</div>
      </div>
    </div>,
    { ...size },
  )
}
