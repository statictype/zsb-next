'use client'

import gsap from 'gsap'
import Link from 'next/link'
import type { CSSProperties } from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'
import styles from './MagneticButton.module.css'

interface MagneticButtonProps {
  href: string
  children: React.ReactNode
  className?: string
  external?: boolean
  /** Fill / border accent color (any CSS value). Defaults to var(--pink). */
  color?: string
  /** Resting text color. Defaults to var(--white). */
  textColor?: string
  /** Text color on hover. Defaults to var(--white). */
  hoverTextColor?: string
}

export function MagneticButton({
  href,
  children,
  className,
  external,
  color,
  textColor,
  hoverTextColor,
}: MagneticButtonProps) {
  const btnRef = useRef<HTMLAnchorElement>(null)
  const cursorRef = useRef<HTMLDivElement>(null)
  const mousePos = useRef({ x: 0, y: 0 })
  const cursorPos = useRef({ x: 0, y: 0 })
  const rafId = useRef<number>(0)
  const [hovering, setHovering] = useState(false)

  // Smooth cursor follow loop — runs only while hovering
  useEffect(() => {
    if (!hovering) return
    const tick = () => {
      const cur = cursorRef.current
      if (!cur) return
      cursorPos.current.x += (mousePos.current.x - cursorPos.current.x) * 0.15
      cursorPos.current.y += (mousePos.current.y - cursorPos.current.y) * 0.15
      gsap.set(cur, { x: cursorPos.current.x, y: cursorPos.current.y })
      rafId.current = requestAnimationFrame(tick)
    }
    rafId.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId.current)
  }, [hovering])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const btn = btnRef.current
    if (!btn) return

    mousePos.current = { x: e.clientX, y: e.clientY }

    const rect = btn.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    const dx = e.clientX - cx
    const dy = e.clientY - cy
    const dist = Math.sqrt(dx * dx + dy * dy)
    const strength = Math.max(0, 1 - dist / 120)

    gsap.to(btn, {
      x: dx * strength * 0.4,
      y: dy * strength * 0.35,
      duration: 0.3,
      ease: 'power2.out',
    })
  }, [])

  const handleMouseEnter = useCallback((e: React.MouseEvent) => {
    mousePos.current = { x: e.clientX, y: e.clientY }
    cursorPos.current = { x: e.clientX, y: e.clientY }
    setHovering(true)
  }, [])

  const handleMouseLeave = useCallback(() => {
    setHovering(false)
    const btn = btnRef.current
    if (!btn) return
    gsap.to(btn, {
      x: 0,
      y: 0,
      duration: 0.6,
      ease: 'elastic.out(1, 0.4)',
    })
  }, [])

  const handleClick = useCallback((e: React.MouseEvent) => {
    const btn = btnRef.current
    if (!btn) return
    const rect = btn.getBoundingClientRect()
    const ripple = document.createElement('span')
    ripple.className = styles.ripple ?? ''
    const size = Math.max(rect.width, rect.height)
    ripple.style.width = `${size}px`
    ripple.style.height = `${size}px`
    ripple.style.left = `${e.clientX - rect.left - size / 2}px`
    ripple.style.top = `${e.clientY - rect.top - size / 2}px`
    btn.appendChild(ripple)
    setTimeout(() => ripple.remove(), 700)

    gsap.to(btn, {
      scale: 0.96,
      duration: 0.1,
      yoyo: true,
      repeat: 1,
      ease: 'power2.inOut',
    })
  }, [])

  const style: CSSProperties = {}
  if (color) (style as Record<string, string>)['--btn-color'] = color
  if (textColor) (style as Record<string, string>)['--btn-text'] = textColor
  if (hoverTextColor)
    (style as Record<string, string>)['--btn-hover-text'] = hoverTextColor

  const btnClass = [styles.btn, className].filter(Boolean).join(' ')

  const cursorClass = [
    styles.cursor,
    hovering && styles.cursorVisible,
    hovering && styles.cursorHover,
  ]
    .filter(Boolean)
    .join(' ')

  const sharedProps = {
    ref: btnRef,
    className: btnClass,
    style,
    onMouseEnter: handleMouseEnter,
    onMouseMove: handleMouseMove,
    onMouseLeave: handleMouseLeave,
    onClick: handleClick,
  }

  const isExternal =
    external || href.startsWith('http') || href.startsWith('mailto:')

  const cursorEl = <div ref={cursorRef} className={cursorClass} />

  if (isExternal) {
    return (
      <div className={styles.wrap}>
        {cursorEl}
        <a
          {...sharedProps}
          href={href}
          {...(href.startsWith('http') && {
            target: '_blank',
            rel: 'noopener noreferrer',
          })}
        >
          <span className={styles.content}>{children}</span>
        </a>
      </div>
    )
  }

  return (
    <div className={styles.wrap}>
      {cursorEl}
      <Link {...sharedProps} href={href}>
        <span className={styles.content}>{children}</span>
      </Link>
    </div>
  )
}
