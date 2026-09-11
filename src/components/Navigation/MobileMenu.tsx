'use client'

import { Swap as ArkSwap } from '@ark-ui/react/swap'
import { RiCloseLine } from '@remixicon/react'
import Link from 'next/link'
import { type ReactNode, Suspense, useState } from 'react'
import { cx, sva } from 'styled-system/css'
import { Center } from 'styled-system/jsx'
import { navigation, navigationSwap } from 'styled-system/recipes'
import { NavLinks, NavLinksList } from '@/components/Navigation/NavLinks'
import { Button } from '@/components/ui/Button/Button'
import { Dialog } from '@/components/ui/Dialog/Dialog'

const navigationToggle = sva({
  slots: ['toggle', 'dialogToggle'],
  base: {
    // Hamburger — the <button> is the full touch-size surface (transparent); the
    // visible mark is a smaller dark box drawn by ::before, so the tap target
    // stays generous while the chrome reads compact.
    toggle: {
      flexDirection: 'column',
      gap: 'xs',
      position: 'fixed',
      top: 'md',
      right: 'gutter',
      zIndex: 'navToggle',
      pressable: 'inline',
      _before: {
        content: '""',
        position: 'absolute',
        inset: 'sm',
        zIndex: '0',
        background: 'black',
        border: 'hairline',
        pointerEvents: 'none',
        transition: 'interactive',
      },
      '& > *': { position: 'relative', zIndex: '1' },
      color: 'white',
      _hover: { color: 'action' },
      '&:focus-visible::before': {
        outline: 'focus',
        outlineOffset: 'focusInset',
      },
      '&[aria-expanded=true]': { color: 'highlight' },
      md: { display: 'none' },
    },
    dialogToggle: { zIndex: '1', md: { display: 'inline-flex' } },
  },
})

const s = navigation()
const t = navigationToggle()
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
        size="touch"
        className={t.toggle}
        aria-label={isOpen ? 'Close navigation' : 'Open navigation'}
        aria-expanded={isOpen}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <NavigationIcon open={isOpen} />
      </Button>

      <Dialog
        open={isOpen}
        onClose={closeMenu}
        ariaLabel="Site navigation"
        presentation="fullscreen"
      >
        <Center className={s.mobileShell}>
          <div className={cx(s.logo, s.dialogLogo)}>
            <Link href="/" onClick={closeMenu}>
              {logo}
            </Link>
          </div>
          <Button
            variant="icon"
            size="touch"
            className={cx(t.toggle, t.dialogToggle)}
            aria-label="Close navigation"
            aria-expanded={true}
            onClick={closeMenu}
          >
            <NavigationIcon open={isOpen} />
          </Button>
          <Center as="nav" flexDirection="column" gap="md" aria-label="Mobile navigation">
            <Suspense
              fallback={
                <NavLinksList
                  pathname={null}
                  className={mobileLinkClass}
                  context="mobile"
                  onNavigate={closeMenu}
                />
              }
            >
              <NavLinks className={mobileLinkClass} context="mobile" onNavigate={closeMenu} />
            </Suspense>
          </Center>
        </Center>
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
        <RiCloseLine />
      </ArkSwap.Indicator>
    </ArkSwap.Root>
  )
}
