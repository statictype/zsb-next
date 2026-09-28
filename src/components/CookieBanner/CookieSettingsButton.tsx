'use client'

import { Text } from 'styled-system/jsx'
import { Button } from '@/components/ui/Button/Button'
import { CONSENT_COOKIE, CONSENT_REOPEN_EVENT } from '@/lib/constants'
import type { Lang } from '@/types/edition'

const LABEL = { en: 'Cookie Settings', ro: 'Setări cookie' } satisfies Record<Lang, string>

export function CookieSettingsButton({
  className,
  lang = 'en',
}: {
  className?: string | undefined
  lang?: Lang
}) {
  const reopen = () => {
    document.cookie = `${CONSENT_COOKIE}=; path=/; max-age=0; SameSite=Lax`
    window.dispatchEvent(new Event(CONSENT_REOPEN_EVENT))
  }

  return (
    <Button variant="link" className={className} onClick={reopen}>
      <Text variant="label">{LABEL[lang]}</Text>
    </Button>
  )
}
