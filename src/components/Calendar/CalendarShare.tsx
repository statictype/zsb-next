'use client'

import { RiCheckLine, RiLinkM, RiShareLine } from '@remixicon/react'
import { useEffect, useState, useSyncExternalStore } from 'react'
import styles from './CalendarShare.module.css'

// The anchor the shared link lands on — the Calendar `<section>` carries this
// id, so opening a shared link scrolls straight to the programme rather than
// the top of the edition page.
export const PROGRAM_SECTION_ID = 'program'

// Share the calendar exactly as it's being viewed. The active filters already
// live in the URL (ZSB-29), so there's nothing to serialize here — we read
// `location.href` at click time, point its fragment at the programme section,
// and hand it to the platform.
//
// Where the device offers a native share sheet (mobile, some desktops) we use
// it: it covers Facebook, WhatsApp, Messages and "Copy" without a button per
// app. Everywhere else (most desktops) we copy the link to the clipboard and
// confirm inline. Capability is read through a store whose server snapshot is
// `false`, so the first paint — on the server and the client — is always the
// copy-link variant and hydration stays in sync; the real value lands after.
const subscribeNoop = () => () => {}
const getCanShare = () => typeof navigator !== 'undefined' && typeof navigator.share === 'function'

export function CalendarShare() {
  const canNativeShare = useSyncExternalStore(subscribeNoop, getCanShare, () => false)
  const [copied, setCopied] = useState(false)

  // Clear the "copied" confirmation after a beat.
  useEffect(() => {
    if (!copied) return
    const id = window.setTimeout(() => setCopied(false), 2000)
    return () => window.clearTimeout(id)
  }, [copied])

  async function handleShare() {
    const target = new URL(window.location.href)
    target.hash = PROGRAM_SECTION_ID
    const url = target.toString()
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

  const label = canNativeShare ? 'Share' : copied ? 'Link copied' : 'Copy link'
  const Icon = canNativeShare ? RiShareLine : copied ? RiCheckLine : RiLinkM

  return (
    <button
      type="button"
      className={`${styles.share} ${copied ? styles.copied : ''}`}
      onClick={handleShare}
      aria-live="polite"
    >
      <Icon size={15} aria-hidden />
      {label}
    </button>
  )
}
