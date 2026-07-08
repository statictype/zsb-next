'use client'

import { type RemixiconComponentType, RiCheckLine, RiLinkM, RiShareLine } from '@remixicon/react'
import { useEffect, useState, useSyncExternalStore } from 'react'
import { css } from 'styled-system/css'

// The share affordance shared by the calendar (ZSB-33) and the event detail
// (ZSB-50): a native share sheet where the platform offers one, an inline
// "copy link" fallback everywhere else.
//
// Where the device offers a native share sheet (mobile, some desktops) we use
// it: it covers Facebook, WhatsApp, Messages and "Copy" without a button per
// app. Everywhere else (most desktops) we copy the link to the clipboard and
// confirm inline. Capability is read through a store whose server snapshot is
// `false`, so the first paint — on the server and the client — is always the
// copy-link variant and hydration stays in sync; the real value lands after.
const subscribeNoop = () => () => {}
const getCanShare = () => typeof navigator !== 'undefined' && typeof navigator.share === 'function'

export interface ShareLink {
  /** Click handler: share `resolveUrl()` natively, or copy it as a fallback. */
  share: () => Promise<void>
  /** The fallback copied the link just now (clears itself after a beat). */
  copied: boolean
  /** Button label reflecting the current capability + state. */
  label: string
  /** Icon matching the label. */
  Icon: RemixiconComponentType
}

// `resolveUrl` is read at click time, so callers can hand back the live URL
// (e.g. `window.location.href`) without re-running the hook on every change.
export function useShareLink(resolveUrl: () => string): ShareLink {
  const canNativeShare = useSyncExternalStore(subscribeNoop, getCanShare, () => false)
  const [copied, setCopied] = useState(false)

  // Clear the "copied" confirmation after a beat.
  useEffect(() => {
    if (!copied) return
    const id = window.setTimeout(() => setCopied(false), 2000)
    return () => window.clearTimeout(id)
  }, [copied])

  async function share() {
    const url = resolveUrl()
    if (canNativeShare) {
      try {
        await navigator.share({ title: document.title, url })
        return
      } catch {
        // The user dismissed the sheet, or the platform refused — fall through
        // to copying so the action still does something useful.
      }
    }
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
    } catch {
      // Clipboard blocked (insecure context / denied permission) — nothing more
      // we can gracefully do; leave the button as-is.
    }
  }

  return {
    share,
    copied,
    label: canNativeShare ? 'Share' : copied ? 'Link copied' : 'Copy link',
    Icon: canNativeShare ? RiShareLine : copied ? RiCheckLine : RiLinkM,
  }
}

// The look both share buttons layer onto the ghost <Button>, kept beside the
// behavior they dress up. Icon nudge on hover:
export const shareIcon = css({
  '& svg': {
    transitionProperty: '[transform]',
    transitionDuration: 'fast',
    transitionTimingFunction: 'quint',
  },
  _hover: { '& svg': { transform: 'translateY(-2px)' } },
  _motionReduce: { '& svg': { transitionDuration: 'instant' } },
})
// Copied — settle into the chartreuse "confirmed" accent used across the board.
export const shareCopied = css({
  color: 'highlight',
  borderColor: 'highlight',
  _hover: { color: 'highlight', borderColor: 'highlight' },
})
