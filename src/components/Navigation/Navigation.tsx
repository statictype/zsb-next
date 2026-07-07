import Image from 'next/image'
import Link from 'next/link'
import { Suspense } from 'react'
import { cx } from 'styled-system/css'
import { MobileMenu } from './MobileMenu'
import { navigation } from './Navigation.recipe'
import { NavLinks, NavLinksList } from './NavLinks'

const s = navigation()
const desktopLinkClass = cx(s.navLink, s.desktopNavLink)

/**
 * Server shell — logo + desktop nav wrapper. Mounted once in `(site)/layout.tsx`;
 * interactivity lives in the client leaves: `NavLinks` (pathname → aria-current)
 * and `MobileMenu` (toggle + Dialog).
 */
export function Navigation() {
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
      <div className={s.logo}>
        <Link href="/">{logo}</Link>
      </div>

      <nav className={s.desktopNav} aria-label="Primary navigation">
        <Suspense fallback={<NavLinksList pathname={null} className={desktopLinkClass} />}>
          <NavLinks className={desktopLinkClass} />
        </Suspense>
      </nav>

      <MobileMenu logo={logo} />
    </>
  )
}
