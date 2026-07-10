import { sva } from 'styled-system/css'

/**
 * PartnerBadge — co-located slot recipe.
 *
 * Size variants keep the badge and center icon geometry together, so parent
 * layouts choose the placement context without reaching into the badge internals.
 * The hover-scale lives on `body` below, which is what lets the component
 * itself stay a server component.
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
      // `body` fills the link, so hovering anywhere on the badge scales it.
      transition: 'develop',
      _hover: { transform: 'scale(1.12)' },
    },
    textRing: {
      position: 'absolute',
      inset: '0',
      animationStyle: 'spin',
      '& svg': { width: 'full', height: 'full' },
      '& text': {
        fill: 'white',
        textStyle: 'partnerBadge.ringType',
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
