'use client'

import { Swap as ArkSwap } from '@ark-ui/react/swap'
import { RiCloseLine } from '@remixicon/react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { type ReactNode, Suspense, useEffect, useRef, useState } from 'react'
import { cx, sva } from 'styled-system/css'
import { Center } from 'styled-system/jsx'
import { navigation, navigationSwap } from 'styled-system/recipes'
import { NAV_ITEMS, NavLinks, NavLinksList } from '@/components/Navigation/NavLinks'
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

export function MobileMenu({ logo }: { logo: ReactNode }) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const closeMenu = () => setIsOpen(false)
  const toggleMenu = () => {
    if (!isOpen) {
      for (const item of NAV_ITEMS) router.prefetch(item.href)
    }
    setIsOpen((prev) => !prev)
  }

  return (
    <>
      <Button
        variant="icon"
        size="touch"
        className={t.toggle}
        aria-label={isOpen ? 'Close navigation' : 'Open navigation'}
        aria-expanded={isOpen}
        onClick={toggleMenu}
      >
        <NavigationIcon open={isOpen} />
      </Button>

      <Suspense fallback={null}>
        <CloseOnPathChange onChange={closeMenu} />
      </Suspense>

      <Dialog
        open={isOpen}
        onClose={closeMenu}
        ariaLabel="Site navigation"
        presentation="fullscreen"
      >
        <Center className={s.mobileShell}>
          <div className={cx(s.logo, s.dialogLogo)}>
            <Link
              href="/"
              onClick={() => {
                if (window.location.pathname === '/') closeMenu()
              }}
            >
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

function CloseOnPathChange({ onChange }: { onChange: () => void }) {
  const pathname = usePathname()
  const previous = useRef(pathname)
  useEffect(() => {
    if (previous.current === pathname) return
    previous.current = pathname
    onChange()
  }, [pathname, onChange])
  return null
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
