'use client'

import gsap from 'gsap'
import Link from 'next/link'
import type { CSSProperties } from 'react'
import { useRef } from 'react'
import styles from './MagneticButton.module.css'

type ButtonVariant = 'primary' | 'secondary'
type ButtonSize = 'lg' | 'md' | 'sm'

interface MagneticButtonProps {
  href: string
  children: React.ReactNode
  className?: string
  external?: boolean
  variant?: ButtonVariant
  size?: ButtonSize
  /** Fill / border accent color (any CSS value). Defaults to var(--pink). */
  color?: string
  /** Resting text color. Defaults to var(--white). */
  textColor?: string
  /** Text color on hover. Defaults to var(--white). */
  hoverTextColor?: string
}

const sizeTokens: Record<ButtonSize, Record<string, string>> = {
  sm: {
    '--btn-padding-y': '8px',
    '--btn-padding-x': '20px',
    '--btn-font-size': '10px',
    '--btn-gap': '6px',
    '--btn-letter-spacing': '1.5px',
  },
  md: {
    '--btn-padding-y': '14px',
    '--btn-padding-x': '32px',
    '--btn-font-size': '12px',
    '--btn-gap': '10px',
    '--btn-letter-spacing': '2px',
  },
  lg: {
    '--btn-padding-y': '20px',
    '--btn-padding-x': '44px',
    '--btn-font-size': '14px',
    '--btn-gap': '14px',
    '--btn-letter-spacing': '2.5px',
  },
}

export function MagneticButton({
  href,
  children,
  className,
  external,
  variant = 'primary',
  size = 'md',
  color,
  textColor,
  hoverTextColor,
}: MagneticButtonProps) {
  const btnRef = useRef<HTMLAnchorElement>(null)

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
    gsap.to(btn, {
      x: 0,
      y: 0,
      duration: 0.6,
      ease: 'elastic.out(1, 0.4)',
    })
  }

  function handleClick(e: React.MouseEvent) {
    const btn = btnRef.current
    if (!btn) return

    const rect = btn.getBoundingClientRect()
    if (variant === 'primary') {
      const ripple = document.createElement('span')
      ripple.className = styles.ripple ?? ''
      const sz = Math.max(rect.width, rect.height)
      ripple.style.width = `${sz}px`
      ripple.style.height = `${sz}px`
      ripple.style.left = `${e.clientX - rect.left - sz / 2}px`
      ripple.style.top = `${e.clientY - rect.top - sz / 2}px`
      btn.appendChild(ripple)
      setTimeout(() => ripple.remove(), 700)
    }

    gsap.to(btn, {
      scale: 0.96,
      duration: 0.1,
      yoyo: true,
      repeat: 1,
      ease: 'power2.inOut',
    })
  }

  const style: CSSProperties = { ...sizeTokens[size] } as CSSProperties
  if (color) (style as Record<string, string>)['--btn-color'] = color
  if (textColor) (style as Record<string, string>)['--btn-text'] = textColor
  if (hoverTextColor) (style as Record<string, string>)['--btn-hover-text'] = hoverTextColor

  const btnClass = [
    styles.btn,
    variant === 'primary' ? styles.primary : styles.secondary,
    className,
  ]
    .filter(Boolean)
    .join(' ')

  const sharedProps = {
    ref: btnRef,
    className: btnClass,
    style,
    onMouseMove: handleMouseMove,
    onMouseLeave: handleMouseLeave,
    onClick: handleClick,
  }

  const isExternal = external || href.startsWith('http') || href.startsWith('mailto:')

  const inner = <span className={styles.content}>{children}</span>

  if (isExternal) {
    return (
      <a
        {...sharedProps}
        href={href}
        {...(href.startsWith('http') && {
          target: '_blank',
          rel: 'noopener noreferrer',
        })}
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
