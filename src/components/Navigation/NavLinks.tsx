'use client'

import Link, { useLinkStatus } from 'next/link'
import { usePathname } from 'next/navigation'
import { NavigationLabel } from 'styled-system/jsx'
import { useReportPending } from '@/components/Navigation/navigation-pending'

export const NAV_ITEMS = [
  { label: 'About', href: '/about' },
  { label: 'Editions', href: '/editions' },
  { label: 'Partners', href: '/partners' },
  { label: 'Visit', href: '/visit' },
] as const

const THRESHOLD_INKS = ['gray', 'burn', 'dodge'] as const

function isExactPage(pathname: string, href: string): boolean {
  return pathname === href
}

function isSectionActive(pathname: string, href: string): boolean {
  return isExactPage(pathname, href) || pathname.startsWith(`${href}/`)
}

type NavLinksProps = {
  className: string | undefined
  context: 'desktop' | 'mobile'
  onNavigate?: () => void
}

function NavLinkLabel({ label, context }: { label: string; context: 'desktop' | 'mobile' }) {
  const { pending } = useLinkStatus()
  useReportPending(pending)

  const roll = (
    <span data-nav-mask>
      <NavigationLabel context={context} data-nav-label>
        {label}
        <NavigationLabel context={context} aria-hidden data-nav-copy>
          {label}
        </NavigationLabel>
      </NavigationLabel>
    </span>
  )

  if (context === 'mobile') return roll

  return (
    <>
      {THRESHOLD_INKS.map((ink) => (
        <span key={ink} data-ink={ink} aria-hidden>
          {roll}
        </span>
      ))}
      <span data-ink="invert">{roll}</span>
      <span data-ink="accent" aria-hidden>
        {roll}
      </span>
    </>
  )
}

export function NavLinksList({
  pathname,
  className,
  context,
  onNavigate,
}: NavLinksProps & { pathname: string | null }) {
  return NAV_ITEMS.map((item) => {
    const exactPage = pathname !== null && isExactPage(pathname, item.href)
    const sectionActive = pathname !== null && isSectionActive(pathname, item.href)
    const closesOnClick = pathname === null || exactPage

    return (
      <Link
        key={item.href}
        href={item.href}
        className={className}
        aria-current={exactPage ? 'page' : undefined}
        data-active={sectionActive ? true : undefined}
        {...(exactPage ? { tabIndex: -1 } : {})}
        {...(onNavigate && closesOnClick ? { onClick: onNavigate } : {})}
      >
        <NavLinkLabel label={item.label} context={context} />
      </Link>
    )
  })
}

// usePathname() is runtime data under cacheComponents; mount under <Suspense> with a
// `<NavLinksList pathname={null}>` fallback or fallback-shell prerenders fail.
export function NavLinks(props: NavLinksProps) {
  const pathname = usePathname()
  return <NavLinksList pathname={pathname} {...props} />
}
