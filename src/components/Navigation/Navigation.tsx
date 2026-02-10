'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import styles from './Navigation.module.css'

function getActiveFromPath(pathname: string): string {
  if (pathname === '/') return 'home'
  if (pathname.startsWith('/editions')) return 'editions'
  if (pathname.startsWith('/partners')) return 'partners'
  return 'home'
}

const NAV_ITEMS = [
  { id: 'home', label: 'Home', href: '/' },
  { id: 'editions', label: 'Editions', href: '/editions' },
  { id: 'artists', label: 'Artists', href: '#' },
  { id: 'visit', label: 'Visit', href: '#' },
] as const

export function Navigation() {
  const pathname = usePathname()
  const active = getActiveFromPath(pathname)
  const showLogoLink = pathname !== '/'
  const [isOpen, setIsOpen] = useState(false)

  const closeMenu = useCallback(() => {
    setIsOpen(false)
  }, [])

  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) closeMenu()
    }
    document.addEventListener('keydown', handleKeydown)
    return () => document.removeEventListener('keydown', handleKeydown)
  }, [isOpen, closeMenu])

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // Close menu on navigation
  useEffect(() => {
    closeMenu()
  }, [closeMenu])

  const logoImg = (
    <Image
      src="/img/logo.png"
      alt="ZSB Logo"
      width={100}
      height={100}
      className={styles.logoImg}
      priority
    />
  )

  return (
    <>
      <div className={styles.logo}>
        {showLogoLink ? <Link href="/">{logoImg}</Link> : logoImg}
      </div>

      <button
        type="button"
        className={styles.toggle}
        aria-label="Toggle navigation"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <span />
        <span />
        <span />
      </button>

      <nav className={`${styles.nav} ${isOpen ? styles.isOpen : ''}`}>
        {NAV_ITEMS.map((item) => {
          const isActive = item.id === active
          const className = isActive
            ? `${styles.navLink} ${styles.active}`
            : styles.navLink

          if (item.href === '#') {
            return (
              // biome-ignore lint/a11y/useValidAnchor: placeholder link
              <a key={item.id} href="#" className={className}>
                <span>{item.label}</span>
              </a>
            )
          }

          return (
            <Link key={item.id} href={item.href} className={className}>
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </>
  )
}
