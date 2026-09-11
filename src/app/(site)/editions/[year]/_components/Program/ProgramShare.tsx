'use client'

import { shareCopied, useShareLink } from '@program/useShareLink'
import { css } from 'styled-system/css'
import { Button } from '@/components/ui/Button/Button'
import { PROGRAM_SECTION_ID } from '@/lib/edition-href'

const srOnly = css({ layerStyle: 'srOnly' })

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
