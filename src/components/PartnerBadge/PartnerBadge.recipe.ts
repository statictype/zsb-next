import { sva } from 'styled-system/css'

/**
 * PartnerBadge — co-located slot recipe.
 *
 * Size variants keep the badge and center icon geometry together, so parent
 * layouts choose the placement context without reaching into the badge internals.
 * The hover-scale lives on `body` below, which is what lets the component
 * itself stay a server component.
 */
const SIZE = {
  standard: { base: '[72px]', md: '[96px]', xl: '[125px]' },
  standardIcon: { base: '[20px]', md: '[26px]', xl: '[36px]' },
  footer: { base: '[100.8px]', md: '[115.2px]', xl: '[150px]' },
  footerIcon: { base: '[28px]', md: '[31.2px]', xl: '[43.2px]' },
  upcoming: { base: '[108px]', md: '[144px]', xl: '[187.5px]' },
  upcomingIcon: { base: '[30px]', md: '[39px]', xl: '[54px]' },
} as const

export const partnerBadge = sva({
  slots: ['wrap', 'link', 'body', 'textRing', 'arrow', 'icon'],
  base: {
    wrap: {
      zIndex: '10',
    },
    link: {
      pressable: 'dim',
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
        fontFamily: 'body',
        fontSize: '[40px]',
        fontWeight: 'semibold',
        letterSpacing: '[8px]',
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
        wrap: { width: SIZE.standard, height: SIZE.standard },
        icon: { width: SIZE.standardIcon, height: SIZE.standardIcon },
      },
      footer: {
        wrap: { width: SIZE.footer, height: SIZE.footer },
        icon: { width: SIZE.footerIcon, height: SIZE.footerIcon },
      },
      upcoming: {
        wrap: { width: SIZE.upcoming, height: SIZE.upcoming },
        icon: { width: SIZE.upcomingIcon, height: SIZE.upcomingIcon },
      },
    },
  },
  defaultVariants: { size: 'standard' },
})
