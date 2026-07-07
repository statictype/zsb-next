'use client'

// Renders only when the root layout itself crashes, replacing <html> entirely —
// no fonts, no panda.css, no styled-system guarantees. Inline styles only.
export default function GlobalError({ reset }: { reset: () => void }) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: '100svh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '24px',
          background: '#0e0b10',
          color: '#fff',
          fontFamily: 'system-ui, sans-serif',
          textAlign: 'center',
          padding: '24px',
        }}
      >
        <h1
          style={{ margin: 0, fontSize: '20px', textTransform: 'uppercase', letterSpacing: '2px' }}
        >
          Something went wrong
        </h1>
        <button
          type="button"
          onClick={reset}
          style={{
            background: 'transparent',
            color: '#fff',
            border: '1px solid rgba(255, 255, 255, 0.4)',
            padding: '14px 28px',
            fontSize: '12px',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            cursor: 'pointer',
          }}
        >
          Try again
        </button>
      </body>
    </html>
  )
}
