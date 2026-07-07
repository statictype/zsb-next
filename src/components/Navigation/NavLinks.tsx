'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV_ITEMS = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Editions', href: '/editions' },
  { label: 'Artists', href: '/artists' },
] as const

/** Exact match for `/`, section-prefix match otherwise (`/editions/2024` lights Editions). */
function isActive(pathname: string, href: string): boolean {
  if (href === '/') return pathname === '/'
  return pathname === href || pathname.startsWith(`${href}/`)
}

type NavLinksProps = {
  className: string | undefined
  onNavigate?: (() => void) | undefined
}

/**
 * Pure link list. `pathname: null` renders without aria-current — used as the
 * Suspense fallback so the static shell carries the links themselves.
 */
export function NavLinksList({
  pathname,
  className,
  onNavigate,
}: NavLinksProps & { pathname: string | null }) {
  return NAV_ITEMS.map((item) => (
    <Link
      key={item.href}
      href={item.href}
      className={className}
      aria-current={pathname !== null && isActive(pathname, item.href) ? 'page' : undefined}
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

/**
 * Under cacheComponents, usePathname() is runtime data when the route's params
 * aren't known at build time — always mount this under <Suspense> with a
 * `<NavLinksList pathname={null}>` fallback, or fallback-shell prerenders fail.
 */
export function NavLinks(props: NavLinksProps) {
  const pathname = usePathname()
  return <NavLinksList pathname={pathname} {...props} />
}
