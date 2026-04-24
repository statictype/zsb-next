import Link from 'next/link'
import { CookieSettingsButton } from '@/components/CookieBanner/CookieSettingsButton'
import { PartnerBadge } from '@/components/PartnerBadge/PartnerBadge'
import styles from './Footer.module.css'

const CURRENT_YEAR = new Date().getFullYear()
const BARCODE_LABEL = `ZSB\u20142021\u2014${CURRENT_YEAR}`

const EXPLORE_LINKS = [
  { label: '#celalatcorp', href: '/editions/2025' },
  { label: '#syzygy', href: '/editions/2024' },
  { label: 're#situariafective', href: '/editions/2023' },
  { label: '#perspectiva31', href: '/editions/2022' },
] as const

const CONNECT_LINKS = [
  { label: 'Contact', href: '#' },
  { label: 'Partners', href: '/partners' },
  { label: 'Press', href: '/press' },
  { label: 'Visit', href: '/visit' },
] as const

const SOCIAL_LINKS = [
  { label: 'Instagram', href: '#' },
  { label: 'Facebook', href: '#' },
  { label: 'TikTok', href: '#' },
] as const

function FooterLink({
  href,
  children,
  className,
}: {
  href: string
  children: React.ReactNode
  className?: string | undefined
}) {
  if (href === '#' || href.startsWith('http')) {
    return (
      <a href={href} className={className}>
        {children}
      </a>
    )
  }
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  )
}

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.top}>
          {/* Left: Rotated Wordmark */}
          <div className={styles.brand}>
            <div className={styles.wordmark}>
              ZSB<span className={styles.wordmarkAccent}>.</span>
            </div>
          </div>

          {/* Center: Links Grid */}
          <div className={styles.linksGrid}>
            <div className={styles.linksCol}>
              <div className={styles.linksColTitle}>Explore</div>
              {EXPLORE_LINKS.map((link) => (
                <FooterLink key={link.label} href={link.href} className={styles.link}>
                  {link.label}
                </FooterLink>
              ))}
            </div>
            <div className={styles.linksCol}>
              <div className={styles.linksColTitle}>Connect</div>
              {CONNECT_LINKS.map((link) => (
                <FooterLink key={link.label} href={link.href} className={styles.link}>
                  {link.label}
                </FooterLink>
              ))}
            </div>
            <div className={`${styles.linksCol} ${styles.badgeCol}`}>
              <PartnerBadge />
            </div>
          </div>

          {/* Right: Social & Barcode */}
          <div className={styles.connect}>
            <div className={styles.social}>
              {SOCIAL_LINKS.map((link) => (
                <a key={link.label} href={link.href} className={styles.socialLink}>
                  {link.label}
                </a>
              ))}
            </div>
            <div>
              <div className={styles.barcode} />
              <div className={styles.barcodeLabel}>{BARCODE_LABEL}</div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className={styles.bottom}>
          <div className={styles.legal}>
            <Link href="/privacy">Privacy Policy</Link>
            <CookieSettingsButton />
          </div>
          <div className={styles.tagline}>
            Filiala <span>&times;</span> de <span>&times;</span> Sculptura
          </div>
          <div>&copy; {CURRENT_YEAR} Bucharest Sculpture Days</div>
        </div>
      </div>
    </footer>
  )
}
