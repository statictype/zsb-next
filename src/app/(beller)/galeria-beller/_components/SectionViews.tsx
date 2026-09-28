'use client'

import { useEffect } from 'react'
import { trackEvent } from '@/lib/analytics'

export function SectionViews() {
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!(entry.isIntersecting && entry.target instanceof HTMLElement)) continue
        observer.unobserve(entry.target)
        trackEvent('section_view', { section: entry.target.dataset.sectionView ?? '' })
      }
    })
    for (const el of document.querySelectorAll('[data-section-view]')) observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return null
}
