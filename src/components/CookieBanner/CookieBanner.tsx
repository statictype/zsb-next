'use client'

import { GoogleAnalytics } from '@next/third-parties/google'
import Link from 'next/link'
import { useSyncExternalStore } from 'react'
import { createPortal } from 'react-dom'
import { cx } from 'styled-system/css'
import { enter } from '@/components/enter'
import { Button } from '@/components/ui/Button/Button'
import { CONSENT_COOKIE, CONSENT_REOPEN_EVENT, GA_MEASUREMENT_ID } from '@/lib/constants'
import { cookieBanner } from './CookieBanner.recipe'

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
  const s = cookieBanner()

  return (
    <>
      {loadAnalytics ? <GoogleAnalytics gaId={GA_MEASUREMENT_ID} /> : null}
      {showBanner
        ? createPortal(
            <div
              role="dialog"
              aria-live="polite"
              aria-label="Cookie consent"
              className={cx(s.banner, enter({ speed: 'normal' }))}
            >
              <div className={s.inner}>
                <div className={s.copy}>
                  <p className={s.title}>We use cookies</p>
                  <p className={s.text}>
                    We use Google Analytics to understand how visitors use this site. No ads, no
                    tracking across other sites.{' '}
                    <Link href="/privacy" className={s.link}>
                      Read our privacy policy
                    </Link>
                    .
                  </p>
                </div>
                <div className={s.actions}>
                  <Button variant="ghost" size="sm" onClick={reject}>
                    Reject
                  </Button>
                  <Button variant="primary" size="sm" onClick={accept}>
                    Accept
                  </Button>
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  )
}
