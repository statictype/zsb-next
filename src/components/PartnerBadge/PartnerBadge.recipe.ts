import { sva } from 'styled-system/css'

/**
 * PartnerBadge — co-located slot recipe.
 *
 * Size variants keep the badge and center icon geometry together, so parent
 * layouts choose the placement context without reaching into the badge internals.
 * The elastic hover-scale lives on `body` below (a tokenized spring), which is
 * what lets the component itself stay a server component.
 */
export const partnerBadge = sva({
  slots: ['wrap', 'link', 'body', 'textRing', 'arrow', 'icon'],
  base: {
    wrap: {
      zIndex: '10',
    },
    link: {
      display: 'block',
      width: 'full',
      height: 'full',
      color: 'current',
      textDecoration: 'none',
    },
    body: {
      position: 'relative',
      width: 'full',
      height: 'full',
      willChange: 'transform',
      // Elastic hover-scale (formerly two gsap.to calls): a springy bezier
      // everywhere, upgraded to a `linear()` elastic — overshoot + one
      // bounce-back — where supported. `body` fills the link, so hovering
      // anywhere on the badge triggers it.
      transition: 'transform',
      transitionDuration: 'reveal',
      transitionTimingFunction: 'elastic',
      '@supports (transition-timing-function: linear(0, 1))': {
        transitionTimingFunction: 'elasticLinear',
      },
      _hover: { transform: 'scale(1.12)' },
      _motionReduce: { transitionDuration: 'instant' },
    },
    textRing: {
      position: 'absolute',
      inset: '0',
      animationStyle: 'spin',
      '& svg': { width: 'full', height: 'full' },
      '& text': {
        fill: 'white',
        fontFamily: 'body',
        fontSize: 'badgeRing',
        fontWeight: 'semibold',
        letterSpacing: 'badgeRing',
      },
    },
    arrow: { position: 'relative', zIndex: '1', display: 'flex' },
    icon: {
      color: 'action',
    },
  },
  variants: {
    size: {
      standard: {
        wrap: { width: 'partnerBadgeStandard', height: 'partnerBadgeStandard' },
        icon: { width: 'partnerBadgeStandardIcon', height: 'partnerBadgeStandardIcon' },
      },
      footer: {
        wrap: { width: 'partnerBadgeFooter', height: 'partnerBadgeFooter' },
        icon: { width: 'partnerBadgeFooterIcon', height: 'partnerBadgeFooterIcon' },
      },
      hero: {
        wrap: { width: 'partnerBadgeHero', height: 'partnerBadgeHero' },
        icon: { width: 'partnerBadgeHeroIcon', height: 'partnerBadgeHeroIcon' },
      },
      upcoming: {
        wrap: { width: 'partnerBadgeUpcoming', height: 'partnerBadgeUpcoming' },
        icon: { width: 'partnerBadgeUpcomingIcon', height: 'partnerBadgeUpcomingIcon' },
      },
    },
  },
  defaultVariants: { size: 'standard' },
})
