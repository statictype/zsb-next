'use client'

import type { ProgramLabels } from '@program/program-labels'
import {
  type RemixiconComponentType,
  RiCheckLine,
  RiErrorWarningLine,
  RiLinkM,
  RiShareLine,
} from '@remixicon/react'
import { useEffect, useState, useSyncExternalStore } from 'react'
import { css } from 'styled-system/css'

const subscribeNoop = () => () => {}
const getCanShare = () => typeof navigator !== 'undefined' && typeof navigator.share === 'function'

export interface ShareLink {
  share: () => Promise<void>
  copied: boolean
  label: string
  status: string
  Icon: RemixiconComponentType
}

export function useShareLink(
  resolveUrl: () => string,
  labels: Pick<
    ProgramLabels,
    'share' | 'copyLink' | 'linkCopied' | 'copyFailed' | 'copyFailedStatus'
  >,
): ShareLink {
  const canNativeShare = useSyncExternalStore(subscribeNoop, getCanShare, () => false)
  const [outcome, setOutcome] = useState<'idle' | 'copied' | 'failed'>('idle')

  useEffect(() => {
    if (outcome === 'idle') return
    const id = window.setTimeout(() => setOutcome('idle'), 2000)
    return () => window.clearTimeout(id)
  }, [outcome])

  async function share() {
    const url = resolveUrl()
    if (canNativeShare) {
      try {
        await navigator.share({ title: document.title, url })
        return
      } catch {}
    }
    try {
      await navigator.clipboard.writeText(url)
      setOutcome('copied')
    } catch {
      setOutcome('failed')
    }
  }

  const copied = outcome === 'copied'
  const failed = outcome === 'failed'

  return {
    share,
    copied,
    label: canNativeShare
      ? labels.share
      : failed
        ? labels.copyFailed
        : copied
          ? labels.linkCopied
          : labels.copyLink,
    Icon: canNativeShare
      ? RiShareLine
      : failed
        ? RiErrorWarningLine
        : copied
          ? RiCheckLine
          : RiLinkM,
    status: failed ? labels.copyFailedStatus : copied ? labels.linkCopied : '',
  }
}

export const shareCopied = css({
  color: 'highlight',
  borderColor: 'highlight',
  '& [data-btn-copy]': { color: 'highlight' },
  _hover: { color: 'highlight', borderColor: 'highlight' },
})
