import Link from 'next/link'
import { Suspense } from 'react'
import { cx } from 'styled-system/css'
import { navigation } from 'styled-system/recipes'
import { Logo } from '@/components/Navigation/Logo'
import { MobileMenu } from '@/components/Navigation/MobileMenu'
import { NavigationProgress } from '@/components/Navigation/NavigationProgress'
import { NavLinks, NavLinksList } from '@/components/Navigation/NavLinks'

const s = navigation()
const desktopLinkClass = cx(s.navLink, s.desktopNavLink)

export function Navigation() {
  const logo = <Logo />

  return (
    <>
      <NavigationProgress />
      <div className={s.logo}>
        <Link href="/">{logo}</Link>
      </div>

      <nav className={s.desktopNav} aria-label="Primary navigation">
        <Suspense
          fallback={<NavLinksList pathname={null} className={desktopLinkClass} context="desktop" />}
        >
          <NavLinks className={desktopLinkClass} context="desktop" />
        </Suspense>
      </nav>

      <MobileMenu logo={logo} />
    </>
  )
}
