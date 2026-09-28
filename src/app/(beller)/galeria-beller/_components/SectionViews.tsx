'use client'

import { useEffect } from 'react'
import { trackEvent } from '@/lib/analytics'

export function SectionViews({ ids }: { ids: string[] }) {
  useEffect(() => {
    const pending = new Set(ids)
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        observer.unobserve(entry.target)
        trackEvent('section_view', { section: entry.target.id })
      }
    })
    const observePending = () => {
      for (const id of pending) {
        const el = document.getElementById(id)
        if (!el) continue
        pending.delete(id)
        observer.observe(el)
      }
      if (pending.size === 0) mutations.disconnect()
    }
    const mutations = new MutationObserver(observePending)
    mutations.observe(document.body, { childList: true, subtree: true })
    observePending()
    return () => {
      observer.disconnect()
      mutations.disconnect()
    }
  }, [ids])

  return null
}
