'use client'

import { shareCopied, useShareLink } from '@program/useShareLink'
import { css } from 'styled-system/css'
import { Button } from '@/components/ui/Button/Button'
import { PROGRAM_SECTION_ID } from '@/lib/edition-href'

const srOnly = css({ layerStyle: 'srOnly' })

// Share the program exactly as it's being viewed. The active filters already
// live in the URL (ZSB-29), so there's nothing to serialize here — we read
// `location.href` at click time, point its fragment at the program section,
// and hand it to the platform (native sheet → copy-link fallback via
// `useShareLink`, the same affordance the event detail uses, ZSB-50).
export function ProgramShare() {
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
