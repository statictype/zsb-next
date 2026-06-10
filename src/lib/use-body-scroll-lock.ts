import { useEffect } from 'react'

// Lock page scroll while an overlay is open. The page scrolls on the *viewport*
// (documentElement), not <body> — `body { overflow-x: hidden }` in globals.css
// makes body its own scroll container, so its overflow no longer propagates to
// the viewport. Locking body alone leaves the background freely scrollable;
// lock documentElement instead, and pad for the vanished scrollbar so the page
// doesn't shift sideways.
export function useBodyScrollLock(isLocked: boolean) {
  useEffect(() => {
    if (!isLocked) return
    const html = document.documentElement
    const scrollbarWidth = window.innerWidth - html.clientWidth
    const prevOverflow = html.style.overflow
    const prevPaddingRight = document.body.style.paddingRight
    html.style.overflow = 'hidden'
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`
    }
    return () => {
      html.style.overflow = prevOverflow
      document.body.style.paddingRight = prevPaddingRight
    }
  }, [isLocked])
}
