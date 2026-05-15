'use client'

import { GoogleAnalytics } from '@next/third-parties/google'
import Link from 'next/link'
import { useSyncExternalStore } from 'react'
import { createPortal } from 'react-dom'
import { CONSENT_COOKIE, CONSENT_REOPEN_EVENT, GA_MEASUREMENT_ID } from '@/lib/constants'
import styles from './CookieBanner.module.css'

type Consent = 'granted' | 'denied' | 'unset'

const SIX_MONTHS_SECONDS = 60 * 60 * 24 * 180
const CONSENT_CHANGE_EVENT = 'zsb:consent-change'

function readConsent(): Consent {
  if (typeof document === 'undefined') return 'unset'
  const match = document.cookie.split('; ').find((row) => row.startsWith(`${CONSENT_COOKIE}=`))
  if (!match) return 'unset'
  const value = match.slice(CONSENT_COOKIE.length + 1)
  return value === 'granted' || value === 'denied' ? value : 'unset'
}

function writeConsent(value: 'granted' | 'denied') {
  document.cookie = `${CONSENT_COOKIE}=${value}; path=/; max-age=${SIX_MONTHS_SECONDS}; SameSite=Lax`
  window.dispatchEvent(new Event(CONSENT_CHANGE_EVENT))
}

function subscribe(callback: () => void) {
  window.addEventListener(CONSENT_REOPEN_EVENT, callback)
  window.addEventListener(CONSENT_CHANGE_EVENT, callback)
  return () => {
    window.removeEventListener(CONSENT_REOPEN_EVENT, callback)
    window.removeEventListener(CONSENT_CHANGE_EVENT, callback)
  }
}

function getServerSnapshot(): Consent {
  return 'unset'
}

const emptySubscribe = () => () => {}
const hydratedClient = () => true
const hydratedServer = () => false

export function CookieBanner() {
  const consent = useSyncExternalStore(subscribe, readConsent, getServerSnapshot)
  const hydrated = useSyncExternalStore(emptySubscribe, hydratedClient, hydratedServer)

  const accept = () => writeConsent('granted')
  const reject = () => writeConsent('denied')

  if (!hydrated) return null

  const showBanner = consent === 'unset'
  const loadAnalytics = consent === 'granted' && GA_MEASUREMENT_ID !== ''

  return (
    <>
      {loadAnalytics ? <GoogleAnalytics gaId={GA_MEASUREMENT_ID} /> : null}
      {showBanner
        ? createPortal(
            <div
              role="dialog"
              aria-live="polite"
              aria-label="Cookie consent"
              className={styles.banner}
            >
              <div className={styles.inner}>
                <div className={styles.copy}>
                  <p className={styles.title}>We use cookies</p>
                  <p className={styles.text}>
                    We use Google Analytics to understand how visitors use this site. No ads, no
                    tracking across other sites.{' '}
                    <Link href="/privacy" className={styles.link}>
                      Read our privacy policy
                    </Link>
                    .
                  </p>
                </div>
                <div className={styles.actions}>
                  <button type="button" onClick={reject} className={styles.buttonGhost}>
                    Reject
                  </button>
                  <button type="button" onClick={accept} className={styles.buttonSolid}>
                    Accept
                  </button>
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  )
}
