'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { NavigationLabel } from 'styled-system/jsx'

const NAV_ITEMS = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Editions', href: '/editions' },
  { label: 'Artists', href: '/artists' },
] as const

function isExactPage(pathname: string, href: string): boolean {
  return pathname === href
}

function isSectionActive(pathname: string, href: string): boolean {
  if (href === '/') return isExactPage(pathname, href)
  return isExactPage(pathname, href) || pathname.startsWith(`${href}/`)
}

type NavLinksProps = {
  className: string | undefined
  context: 'desktop' | 'mobile'
  onNavigate?: (() => void) | undefined
}

/**
 * Pure link list. `pathname: null` renders without current state — used as the
 * Suspense fallback so the static shell carries the links themselves.
 */
export function NavLinksList({
  pathname,
  className,
  context,
  onNavigate,
}: NavLinksProps & { pathname: string | null }) {
  return NAV_ITEMS.map((item) => {
    const exactPage = pathname !== null && isExactPage(pathname, item.href)
    const sectionActive = pathname !== null && isSectionActive(pathname, item.href)

    return (
      <Link
        key={item.href}
        href={item.href}
        className={className}
        aria-current={exactPage ? 'page' : undefined}
        data-active={sectionActive ? true : undefined}
        {...(onNavigate ? { onClick: onNavigate } : {})}
      >
        <span data-nav-mask>
          <NavigationLabel context={context} data-nav-label>
            {item.label}
            <NavigationLabel context={context} aria-hidden data-nav-copy>
              {item.label}
            </NavigationLabel>
          </NavigationLabel>
        </span>
      </Link>
    )
  })
}

/**
 * Under cacheComponents, usePathname() is runtime data when the route's params
 * aren't known at build time — always mount this under <Suspense> with a
 * `<NavLinksList pathname={null}>` fallback, or fallback-shell prerenders fail.
 */
export function NavLinks(props: NavLinksProps) {
  const pathname = usePathname()
  return <NavLinksList pathname={pathname} {...props} />
}
