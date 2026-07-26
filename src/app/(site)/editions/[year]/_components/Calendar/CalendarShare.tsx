'use client'

import { shareCopied, useShareLink } from '@calendar/useShareLink'
import { css } from 'styled-system/css'
import { Button } from '@/components/ui/Button/Button'

const srOnly = css({ layerStyle: 'srOnly' })

// The anchor the shared link lands on — the Calendar `<section>` carries this
// id, so opening a shared link scrolls straight to the programme rather than
// the top of the edition page.
export const PROGRAM_SECTION_ID = 'program'

// Share the calendar exactly as it's being viewed. The active filters already
// live in the URL (ZSB-29), so there's nothing to serialize here — we read
// `location.href` at click time, point its fragment at the programme section,
// and hand it to the platform (native sheet → copy-link fallback via
// `useShareLink`, the same affordance the event detail uses, ZSB-50).
export function CalendarShare() {
  const { share, copied, label, status, Icon } = useShareLink(() => {
    const target = new URL(window.location.href)
    target.hash = PROGRAM_SECTION_ID
    return target.toString()
  })

  return (
    <>
      <Button
        variant="secondary"
        size="sm"
        className={copied ? shareCopied : undefined}
        onClick={share}
      >
        <Icon size={15} aria-hidden />
        {label}
      </Button>
      <span role="status" className={srOnly}>
        {status}
      </span>
    </>
  )
}
