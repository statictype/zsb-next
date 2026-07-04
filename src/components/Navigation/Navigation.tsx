'use client'

import { Swap as ArkSwap } from '@ark-ui/react/swap'
import { RiCloseLine } from '@remixicon/react'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { cx } from 'styled-system/css'
import { Button } from '@/components/ui/Button/Button'
import { Dialog } from '@/components/ui/Dialog/Dialog'
import { navigation, navigationSwap } from './Navigation.recipe'

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
  const showLogoLink = activeId !== 'home'

  const logo = (
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
      <div className={s.logo}>{showLogoLink ? <Link href="/">{logo}</Link> : logo}</div>

      <Button
        variant="icon"
        className={s.toggle}
        aria-label={isOpen ? 'Close navigation' : 'Open navigation'}
        aria-expanded={isOpen}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <NavigationIcon open={isOpen} />
      </Button>

      <nav className={s.desktopNav} aria-label="Primary navigation">
        <NavLinks activeId={activeId} className={cx(s.navLink, s.desktopNavLink)} />
      </nav>

      <Dialog
        id="mobile-navigation"
        open={isOpen}
        onClose={closeMenu}
        ariaLabel="Site navigation"
        presentation="fullscreen"
      >
        <div className={s.mobileShell}>
          <div className={cx(s.logo, s.dialogLogo)}>
            {showLogoLink ? <Link href="/">{logo}</Link> : logo}
          </div>
          <Button
            variant="icon"
            className={cx(s.toggle, s.dialogToggle)}
            aria-label="Close navigation"
            aria-expanded={true}
            onClick={closeMenu}
          >
            <NavigationIcon open={isOpen} />
          </Button>
          <nav className={s.mobileNav} aria-label="Mobile navigation">
            <NavLinks activeId={activeId} className={s.navLink} onNavigate={closeMenu} />
          </nav>
        </div>
      </Dialog>
    </>
  )
}

function NavLinks({
  activeId,
  className,
  onNavigate,
}: {
  activeId: NavActiveId
  className: string | undefined
  onNavigate?: (() => void) | undefined
}) {
  return NAV_ITEMS.map((item) => (
    <Link
      key={item.id}
      href={item.href}
      className={className}
      aria-current={item.id === activeId ? 'page' : undefined}
      {...(onNavigate ? { onClick: onNavigate } : {})}
    >
      <span data-nav-mask>
        <span data-nav-label>
          {item.label}
          <span aria-hidden data-nav-copy>
            {item.label}
          </span>
        </span>
      </span>
    </Link>
  ))
}

function NavigationIcon({ open }: { open: boolean }) {
  const icon = navigationSwap()
  return (
    <ArkSwap.Root
      swap={open}
      lazyMount={false}
      unmountOnExit={false}
      className={icon.root}
      aria-hidden
    >
      <ArkSwap.Indicator type="off" className={icon.indicator}>
        <span />
        <span />
        <span />
      </ArkSwap.Indicator>
      <ArkSwap.Indicator type="on" className={icon.indicator}>
        <RiCloseLine size={24} />
      </ArkSwap.Indicator>
    </ArkSwap.Root>
  )
}
