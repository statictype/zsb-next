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

export function NavLinks({
  className,
  onNavigate,
}: {
  className: string | undefined
  onNavigate?: (() => void) | undefined
}) {
  const pathname = usePathname()
  return NAV_ITEMS.map((item) => (
    <Link
      key={item.href}
      href={item.href}
      className={className}
      aria-current={isActive(pathname, item.href) ? 'page' : undefined}
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
