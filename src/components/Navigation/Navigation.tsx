'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { useBodyScrollLock } from '@/lib/use-body-scroll-lock'
import { dispatchGoTo, onSectionChange } from '@/components/FullPageScroll/FullPageScroll'
import styles from './Navigation.module.css'

const SECTION_IDS = ['home', 'about', 'editions', 'artists', 'visit', 'partner', 'footer'] as const

function getActiveFromPath(pathname: string): string {
  if (pathname === '/') return 'home'
  if (pathname.startsWith('/editions')) return 'editions'
  if (pathname.startsWith('/partners')) return 'partners'
  return 'home'
}

const NAV_ITEMS = [
  { id: 'home', label: 'Home', href: '/' },
  { id: 'about', label: 'About', href: '/#about' },
  { id: 'editions', label: 'Editions', href: '/#editions' },
  { id: 'artists', label: 'Artists', href: '/#artists' },
  { id: 'visit', label: 'Visit', href: '/#visit' },
] as const

export function Navigation() {
  const pathname = usePathname()
  const isHome = pathname === '/'
  const [activeId, setActiveId] = useState(isHome ? 'home' : getActiveFromPath(pathname))
  const [isOpen, setIsOpen] = useState(false)

  const closeMenu = useCallback(() => setIsOpen(false), [])

  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) closeMenu()
    }
    document.addEventListener('keydown', handleKeydown)
    return () => document.removeEventListener('keydown', handleKeydown)
  }, [isOpen, closeMenu])

  useBodyScrollLock(isOpen)

  // biome-ignore lint/correctness/useExhaustiveDependencies: pathname triggers menu close
  useEffect(() => { closeMenu() }, [pathname, closeMenu])

  // Listen for section changes from FullPageScroll
  useEffect(() => {
    if (!isHome) {
      setActiveId(getActiveFromPath(pathname))
      return
    }
    return onSectionChange((index) => {
      setActiveId(SECTION_IDS[index] ?? 'home')
    })
  }, [isHome, pathname])

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      closeMenu()
      if (!isHome) return

      e.preventDefault()
      const id = href === '/' ? 'home' : href.replace('/#', '')
      const index = SECTION_IDS.indexOf(id as typeof SECTION_IDS[number])
      if (index !== -1) dispatchGoTo(index)
    },
    [isHome, closeMenu],
  )

  const showLogoLink = !isHome

  const logoImg = (
    <Image
      src="/img/logo_ZSB.svg"
      alt="ZSB Logo"
      width={40}
      height={40}
      className={styles.logoImg}
      preload
    />
  )

  return (
    <header className={styles.bar}>
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
          const isActive = item.id === activeId
          const className = isActive ? `${styles.navLink} ${styles.active}` : styles.navLink

          if (isHome) {
            return (
              <a
                key={item.id}
                href={item.href}
                className={className}
                onClick={(e) => handleClick(e, item.href)}
              >
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
    </header>
  )
}
