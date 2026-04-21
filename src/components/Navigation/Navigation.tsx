'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useBodyScrollLock } from '@/lib/use-body-scroll-lock'
import styles from './Navigation.module.css'

export const SECTION_IDS = ['home', 'about', 'editions', 'artists', 'visit', 'footer'] as const

function getActiveFromPath(pathname: string): string {
  if (pathname === '/') return 'home'
  if (pathname.startsWith('/editions')) return 'editions'
  if (pathname.startsWith('/partners')) return 'partners'
  return 'home'
}

const NAV_ITEMS = [
  { id: 'home', label: 'Latest', href: '/' },
  { id: 'about', label: 'About', href: '/#about' },
  { id: 'editions', label: 'Editions', href: '/#editions' },
  { id: 'artists', label: 'Artists', href: '/#artists' },
  { id: 'visit', label: 'Visit', href: '/#visit' },
] as const

export function Navigation() {
  const pathname = usePathname()
  const isHome = pathname === '/'
  const [activeId, setActiveId] = useState(getActiveFromPath(pathname))
  const [isOpen, setIsOpen] = useState(false)

  const closeMenu = useCallback(() => setIsOpen(false), [])
  const prevPathname = useRef(pathname)

  useBodyScrollLock(isOpen)

  useEffect(() => {
    // Close menu on pathname change
    if (prevPathname.current !== pathname) {
      prevPathname.current = pathname
      closeMenu()
    }

    // Close menu on Escape
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeMenu()
    }
    document.addEventListener('keydown', handleKeydown)

    setActiveId(getActiveFromPath(pathname))

    return () => {
      document.removeEventListener('keydown', handleKeydown)
    }
  }, [pathname, closeMenu])

  const showLogoLink = !isHome

  const logoImg = (
    <Image
      src="/img/logo_ZSB.svg"
      alt="ZSB Logo"
      width={40}
      height={40}
      className={styles.logoImg}
      unoptimized
      preload
    />
  )

  return (
    <header className={styles.bar}>
      <div className={styles.logo}>{showLogoLink ? <Link href="/">{logoImg}</Link> : logoImg}</div>

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
          const isActive = item.id === activeId
          const className = isActive ? `${styles.navLink} ${styles.active}` : styles.navLink

          return (
            <Link key={item.id} href={item.href} className={className} onClick={closeMenu}>
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </header>
  )
}
