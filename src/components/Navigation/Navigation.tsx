'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useBodyScrollLock } from '@/lib/use-body-scroll-lock'
import { navigation } from './Navigation.recipe'

const s = navigation()

export type NavActiveId = 'home' | 'about' | 'editions' | 'artists' | null

const NAV_ITEMS = [
  { id: 'home', label: 'Home', href: '/' },
  { id: 'about', label: 'About', href: '/about' },
  { id: 'editions', label: 'Editions', href: '/editions' },
  { id: 'artists', label: 'Artists', href: '/artists' },
] as const

type Props = {
  activeId: NavActiveId
}

export function Navigation({ activeId }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const closeMenu = () => setIsOpen(false)

  useBodyScrollLock(isOpen)

  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false)
    }
    document.addEventListener('keydown', handleKeydown)
    return () => document.removeEventListener('keydown', handleKeydown)
  }, [])

  const showLogoLink = activeId !== 'home'

  const logoImg = (
    <Image
      src="/img/logo_ZSB.svg"
      alt="ZSB Logo"
      width={60}
      height={60}
      className={s.logoImg}
      unoptimized
      preload
    />
  )

  return (
    <>
      <div className={s.logo}>{showLogoLink ? <Link href="/">{logoImg}</Link> : logoImg}</div>

      <button
        type="button"
        className={s.toggle}
        aria-label="Toggle navigation"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <span />
        <span />
        <span />
      </button>

      <nav className={s.nav} data-open={isOpen}>
        {NAV_ITEMS.map((item) => {
          const isActive = item.id === activeId
          return (
            <Link
              key={item.id}
              href={item.href}
              className={s.navLink}
              aria-current={isActive ? 'page' : undefined}
              onClick={closeMenu}
            >
              {item.label}
            </Link>
          )
        })}
      </nav>
    </>
  )
}
