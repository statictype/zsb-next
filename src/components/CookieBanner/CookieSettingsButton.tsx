'use client'

import { Button } from '@/components/ui/Button/Button'
import { CONSENT_COOKIE, CONSENT_REOPEN_EVENT } from '@/lib/constants'

export function CookieSettingsButton({ className }: { className?: string | undefined }) {
  const reopen = () => {
    document.cookie = `${CONSENT_COOKIE}=; path=/; max-age=0; SameSite=Lax`
    window.dispatchEvent(new Event(CONSENT_REOPEN_EVENT))
  }

  return (
    <Button variant="link" className={className} onClick={reopen}>
      Cookie Settings
    </Button>
  )
}
