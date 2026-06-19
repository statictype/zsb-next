'use client'

import { useIsPresentationTool } from 'next-sanity/hooks'
import { css } from 'styled-system/css'

/**
 * Small "Exit preview" button rendered when draft mode is enabled.
 * Hidden inside the Presentation Tool iframe — editors there already
 * have the Studio's own controls and the floating button would overlap.
 */
export function DisableDraftMode() {
  const inPresentationTool = useIsPresentationTool()
  if (inPresentationTool) return null
  return (
    <a
      href="/api/draft-mode/disable"
      className={css({
        position: 'fixed',
        bottom: '16px',
        right: '16px',
        zIndex: '9999',
        paddingBlock: '8px',
        paddingInline: '14px',
        background: 'heading',
        color: 'canvas',
        fontFamily: 'body',
        fontSize: '12px',
        fontWeight: 'semibold',
        letterSpacing: '0.04em',
        textTransform: 'uppercase',
        textDecoration: 'none',
        borderRadius: 'pill',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
        transition: 'transform {durations.fast} {easings.expo}',
        _hover: { transform: 'translateY(-1px)' },
      })}
    >
      Exit preview
    </a>
  )
}
