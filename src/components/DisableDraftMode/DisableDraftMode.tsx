'use client'

import { useIsPresentationTool } from 'next-sanity/hooks'
import styles from './DisableDraftMode.module.css'

/**
 * Small "Exit preview" button rendered when draft mode is enabled.
 * Hidden inside the Presentation Tool iframe — editors there already
 * have the Studio's own controls and the floating button would overlap.
 */
export function DisableDraftMode() {
  const inPresentationTool = useIsPresentationTool()
  if (inPresentationTool) return null
  return (
    <a href="/api/draft-mode/disable" className={styles.button}>
      Exit preview
    </a>
  )
}
