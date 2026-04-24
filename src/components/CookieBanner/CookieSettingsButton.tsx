'use client'

import { CONSENT_COOKIE, CONSENT_REOPEN_EVENT } from '@/lib/constants'
import styles from './CookieSettingsButton.module.css'

export function CookieSettingsButton() {
  const reopen = () => {
    document.cookie = `${CONSENT_COOKIE}=; path=/; max-age=0; SameSite=Lax`
    window.dispatchEvent(new Event(CONSENT_REOPEN_EVENT))
  }

  return (
    <button type="button" onClick={reopen} className={styles.button}>
      Cookie Settings
    </button>
  )
}
