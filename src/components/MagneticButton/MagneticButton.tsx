'use client'

import gsap from 'gsap'
import Link from 'next/link'
import { useRef } from 'react'
import { css, cx } from 'styled-system/css'
import { type ButtonVariantProps, button } from 'styled-system/recipes'
import { magneticButton } from './MagneticButton.recipe'

interface MagneticButtonProps {
  href: string
  children: React.ReactNode
  className?: string
  external?: boolean
  /** Shared button visual — defaults to the outlined variant. */
  variant?: ButtonVariantProps['variant']
  size?: ButtonVariantProps['size']
  /** Swap the resting fill for a dark hairline + animated gradient border on
   *  hover (the hero CTA). */
  gradientBorder?: boolean
}

// Click ripple — assigned imperatively, so it needs a stable class.
const rippleClass = css({
  position: 'absolute',
  borderRadius: '50%',
  background: 'rgba(255, 255, 255, 0.2)',
  transform: 'scale(0)',
  animation: 'rippleAnim {durations.reveal} {easings.expo} forwards',
  pointerEvents: 'none',
})

export function MagneticButton({
  href,
  children,
  className,
  external,
  variant = 'outline',
  size = 'md',
  gradientBorder,
}: MagneticButtonProps) {
  const btnRef = useRef<HTMLAnchorElement>(null)
  const s = magneticButton({ gradientBorder: gradientBorder ?? false })

  function handleMouseMove(e: React.MouseEvent) {
    const btn = btnRef.current
    if (!btn) return
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
  }

  function handleMouseLeave() {
    const btn = btnRef.current
    if (!btn) return
    gsap.to(btn, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.4)' })
  }

  function handleClick(e: React.MouseEvent) {
    const btn = btnRef.current
    if (!btn) return

    const rect = btn.getBoundingClientRect()
    const ripple = document.createElement('span')
    ripple.className = rippleClass
    const sz = Math.max(rect.width, rect.height)
    ripple.style.width = `${sz}px`
    ripple.style.height = `${sz}px`
    ripple.style.left = `${e.clientX - rect.left - sz / 2}px`
    ripple.style.top = `${e.clientY - rect.top - sz / 2}px`
    btn.appendChild(ripple)
    setTimeout(() => ripple.remove(), 700)

    gsap.to(btn, { scale: 0.96, duration: 0.1, yoyo: true, repeat: 1, ease: 'power2.inOut' })
  }

  const btnClass = cx(button({ variant, size }), s.root, className)

  const sharedProps = {
    ref: btnRef,
    className: btnClass,
    onMouseMove: handleMouseMove,
    onMouseLeave: handleMouseLeave,
    onClick: handleClick,
  }

  const isExternal = external || href.startsWith('http') || href.startsWith('mailto:')
  const inner = <span className={s.content}>{children}</span>

  if (isExternal) {
    return (
      <a
        {...sharedProps}
        href={href}
        {...(href.startsWith('http') && { target: '_blank', rel: 'noopener noreferrer' })}
      >
        {inner}
      </a>
    )
  }

  return (
    <Link {...sharedProps} href={href}>
      {inner}
    </Link>
  )
}
