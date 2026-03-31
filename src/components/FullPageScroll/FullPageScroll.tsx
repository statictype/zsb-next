'use client'

import gsap from 'gsap'
import { Observer } from 'gsap/Observer'
import { useEffect, useRef } from 'react'

gsap.registerPlugin(Observer)

/** Fired when active section changes — Navigation listens for this */
export const SECTION_CHANGE_EVENT = 'zsb:section'

export function dispatchGoTo(index: number) {
  document.dispatchEvent(new CustomEvent('zsb:goto', { detail: index }))
}

export function onSectionChange(cb: (index: number) => void) {
  const handler = (e: Event) => cb((e as CustomEvent<number>).detail)
  document.addEventListener(SECTION_CHANGE_EVENT, handler)
  return () => document.removeEventListener(SECTION_CHANGE_EVENT, handler)
}

interface FullPageScrollProps {
  /** Number of sections (must match the fixed-position section elements in the DOM) */
  sectionCount: number
  /** Section IDs for hash-based deep linking (e.g. ['home', 'about', ...]) */
  sectionIds: readonly string[]
}

const DURATION = 1

/**
 * Sets up GSAP Observer for full-page section-by-section navigation.
 *
 * Sections must be `position: fixed` with `.outer > .inner` wrappers
 * and start as `visibility: hidden`. This component shows the first
 * section on mount and handles all transitions.
 *
 * Renders nothing — pure side-effect component.
 */
export function FullPageScroll({ sectionCount, sectionIds }: FullPageScrollProps) {
  const currentIndexRef = useRef(-1)
  const animatingRef = useRef(false)

  useEffect(() => {
    const sections = document.querySelectorAll<HTMLElement>('[data-section]')
    const outers = document.querySelectorAll<HTMLElement>('[data-section] .fpOuter')
    const inners = document.querySelectorAll<HTMLElement>('[data-section] .fpInner')

    if (sections.length === 0) return

    // Kill any stale GSAP tweens and reset all sections to hidden
    const allEls = [...sections, ...outers, ...inners]
    allEls.forEach((el) => gsap.killTweensOf(el))
    sections.forEach((s) => gsap.set(s, { autoAlpha: 0, zIndex: 0 }))
    outers.forEach((o) => gsap.set(o, { yPercent: 0 }))
    inners.forEach((i) => gsap.set(i, { yPercent: 0 }))
    currentIndexRef.current = -1
    animatingRef.current = false

    const emit = (index: number) => {
      document.dispatchEvent(new CustomEvent(SECTION_CHANGE_EVENT, { detail: index }))
      const id = sectionIds[index]
      const hash = id && id !== sectionIds[0] ? `#${id}` : '/'
      history.replaceState(null, '', hash)
    }

    const gotoSection = (index: number, direction: number) => {
      // Clamp — no wrapping
      if (index < 0 || index >= sectionCount) return
      if (animatingRef.current) return

      animatingRef.current = true
      const prev = currentIndexRef.current
      currentIndexRef.current = index
      emit(index)

      const tl = gsap.timeline({
        defaults: { duration: DURATION, ease: 'power2.inOut' },
        onComplete: () => {
          animatingRef.current = false
        },
      })

      // Animate previous section out
      const prevSection = sections[prev]
      const prevOuter = outers[prev]
      if (prev >= 0 && prevSection && prevOuter) {
        gsap.set(prevSection, { zIndex: 0 })
        tl.to(prevOuter, { yPercent: -15 * direction }, 0).set(prevSection, { autoAlpha: 0 })
      }

      // Animate new section in
      const nextSection = sections[index]
      const nextOuter = outers[index]
      const nextInner = inners[index]
      if (nextSection && nextOuter && nextInner) {
        gsap.set(nextSection, { autoAlpha: 1, zIndex: 1 })

        tl.fromTo(
          [nextOuter, nextInner],
          { yPercent: (i: number) => (i ? -100 * direction : 100 * direction) },
          { yPercent: 0 },
          0,
        )
      }
    }

    // Show initial section immediately (no animation on mount)
    const hash = window.location.hash.replace('#', '')
    const hashIndex = sectionIds.indexOf(hash)
    const startIndex = hashIndex > 0 ? hashIndex : 0
    const startSection = sections[startIndex]
    if (startSection) {
      gsap.set(startSection, { autoAlpha: 1, zIndex: 1 })
      currentIndexRef.current = startIndex
      emit(startIndex)
    }

    // GSAP Observer — wheel, touch, pointer
    const observer = Observer.create({
      type: 'wheel,touch,pointer',
      wheelSpeed: -1,
      onDown: () => !animatingRef.current && gotoSection(currentIndexRef.current - 1, -1),
      onUp: () => !animatingRef.current && gotoSection(currentIndexRef.current + 1, 1),
      tolerance: 10,
      preventDefault: true,
    })

    // Keyboard
    const onKeyDown = (e: KeyboardEvent) => {
      if (animatingRef.current) return
      const cur = currentIndexRef.current
      switch (e.key) {
        case 'ArrowDown':
        case ' ':
        case 'PageDown':
          e.preventDefault()
          gotoSection(cur + 1, 1)
          break
        case 'ArrowUp':
        case 'PageUp':
          e.preventDefault()
          gotoSection(cur - 1, -1)
          break
      }
    }
    window.addEventListener('keydown', onKeyDown)

    // Nav click requests
    const onGoTo = (e: Event) => {
      const target = (e as CustomEvent<number>).detail
      if (target === currentIndexRef.current) return
      const dir = target > currentIndexRef.current ? 1 : -1
      gotoSection(target, dir)
    }
    document.addEventListener('zsb:goto', onGoTo)

    return () => {
      observer.kill()
      window.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('zsb:goto', onGoTo)
    }
  }, [sectionCount, sectionIds])

  return null
}
