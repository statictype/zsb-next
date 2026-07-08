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
        bottom: 'md',
        right: 'md',
        zIndex: 'draftBadge',
        paddingBlock: 'sm',
        paddingInline: 'md',
        background: 'heading',
        color: 'surface',
        fontFamily: 'body',
        fontSize: 'sm',
        fontWeight: 'semibold',
        letterSpacing: 'label',
        textTransform: 'uppercase',
        borderRadius: 'pill',
        boxShadow: 'badge',
        transitionProperty: '[transform]',
        transitionDuration: 'fast',
        transitionTimingFunction: 'expo',
        _hover: { transform: 'translateY(-1px)' },
      })}
    >
      Exit preview
    </a>
  )
}
