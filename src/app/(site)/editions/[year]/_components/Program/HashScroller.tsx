'use client'

import { useEffect } from 'react'

// The target section streams in behind Suspense, so the browser's native
// fragment scroll fires before the element exists. Mount this inside the
// subtree it targets so `getElementById` finds the element.
export function HashScroller({ id }: { id: string }) {
  useEffect(() => {
    if (window.location.hash === `#${id}`) {
      document.getElementById(id)?.scrollIntoView({ behavior: 'instant' })
    }
  }, [id])
  return null
}
