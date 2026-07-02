'use client'

import { useEffect } from 'react'

// A shared link arrives as `/editions/<year>#program`, but the target section
// streams in behind the route's Suspense boundary — so the browser's native
// fragment scroll usually fires before the element exists and is lost.
// Re-run it once this mounts, when `id` is guaranteed to be in the DOM.
//
// Must mount inside the same Suspense-gated subtree as the element it
// targets (i.e. as a descendant of `#${id}`, not hoisted out to a page-level
// sibling) — otherwise it can mount and read `getElementById` before that
// subtree has streamed in, and silently no-op.
export function HashScroller({ id }: { id: string }) {
  useEffect(() => {
    if (window.location.hash === `#${id}`) {
      document.getElementById(id)?.scrollIntoView({ behavior: 'instant' })
    }
  }, [id])
  return null
}
