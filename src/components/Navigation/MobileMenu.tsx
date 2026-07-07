'use client'

import { Swap as ArkSwap } from '@ark-ui/react/swap'
import { RiCloseLine } from '@remixicon/react'
import Link from 'next/link'
import { type ReactNode, Suspense, useState } from 'react'
import { cx } from 'styled-system/css'
import { Button } from '@/components/ui/Button/Button'
import { Dialog } from '@/components/ui/Dialog/Dialog'
import { navigation, navigationSwap } from './Navigation.recipe'
import { NavLinks, NavLinksList } from './NavLinks'

const s = navigation()
const mobileLinkClass = cx(s.navLink, s.mobileNavLink)

/**
 * Hamburger toggle + fullscreen menu Dialog. Navigation persists across route
 * changes (mounted once in the site layout), so every in-dialog link — nav
 * items and the logo — closes the menu on click.
 */
export function MobileMenu({ logo }: { logo: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const closeMenu = () => setIsOpen(false)

  return (
    <>
      <Button
        variant="icon"
        className={s.toggle}
        aria-label={isOpen ? 'Close navigation' : 'Open navigation'}
        aria-expanded={isOpen}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <NavigationIcon open={isOpen} />
      </Button>

      <Dialog
        id="mobile-navigation"
        open={isOpen}
        onClose={closeMenu}
        ariaLabel="Site navigation"
        presentation="fullscreen"
      >
        <div className={s.mobileShell}>
          <div className={cx(s.logo, s.dialogLogo)}>
            <Link href="/" onClick={closeMenu}>
              {logo}
            </Link>
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
            <Suspense
              fallback={
                <NavLinksList pathname={null} className={mobileLinkClass} onNavigate={closeMenu} />
              }
            >
              <NavLinks className={mobileLinkClass} onNavigate={closeMenu} />
            </Suspense>
          </nav>
        </div>
      </Dialog>
    </>
  )
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
