import { defineRecipe } from '@pandacss/dev'

const colorShift = { _hover: { color: 'action' } } as const
const subtleHover = { _hover: { color: 'heading', borderColor: 'heading' } } as const

/**
 * Button — the one action primitive (ADR 0019).
 * `variant` (primary | secondary | link | icon) × `size` (sm | md | lg).
 * `link` is the retired
 * `textLink` recipe (borderless inline link, e.g. footer links).
 */
export const button = defineRecipe({
  jsx: ['Button'],
  className: 'btn',
  description: 'The one action primitive — primary | secondary | link | icon (ADR 0019)',
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'body',
    fontWeight: 'semibold',
    textTransform: 'uppercase',
    cursor: 'pointer',
    border: 'none',
    transition:
      'color {durations.normal} ease, background-color {durations.normal} ease, border-color {durations.normal} ease, filter {durations.normal} ease',
    _disabled: { opacity: '0.5', cursor: 'not-allowed' },
    _focusVisible: { outline: '2px solid token(colors.action)', outlineOffset: '2px' },
  },
  variants: {
    variant: {
      primary: {
        bg: 'transparent',
        color: 'action',
        border: 'primary',
        _hover: { bg: 'action', color: 'white' },
      },
      secondary: {
        bg: 'transparent',
        color: 'muted',
        border: 'hairline',
        ...subtleHover,
      },
      // Borderless inline text link (the retired `textLink` recipe). Blends into
      // the surrounding copy — inherits font/size/case/tracking from context —
      // e.g. the footer "Cookie Settings" beside the Privacy Policy link.
      link: {
        display: 'inline',
        fontFamily: 'inherit',
        fontSize: 'inherit',
        fontWeight: 'inherit',
        textTransform: 'inherit',
        letterSpacing: 'inherit',
        bg: 'transparent',
        color: 'muted',
        ...colorShift,
        _hover: { ...colorShift._hover, textDecoration: 'underline' },
      },
      icon: {
        width: '44px',
        height: '44px',
        padding: '0',
        background: 'transparent',
        borderWidth: '0',
        color: 'heading',
        transition: 'color {durations.normal} ease, transform {durations.normal} {easings.expo}',
        ...colorShift,
        _hover: { _enabled: { color: 'action', transform: 'translateY(-2px)' } },
      },
    },
    size: {
      sm: {
        fontSize: { base: '9px', md: '10px' },
        letterSpacing: '1.5px',
        gap: '5px',
        paddingBlock: { base: '6px', md: '8px' },
        paddingInline: { base: '16px', md: '20px' },
      },
      md: {
        fontSize: { base: '10px', lg: '11px', '2xl': '13px' },
        letterSpacing: '2px',
        gap: { base: '8px', md: '10px' },
        paddingBlock: { base: '10px', md: '12px', lg: '14px', '2xl': '16px' },
        paddingInline: { base: '24px', md: '28px', lg: '32px', '2xl': '36px' },
      },
      lg: {
        fontSize: { base: '11px', md: '12px', '2xl': '13px' },
        letterSpacing: { base: '2px', lg: '2.5px' },
        gap: { base: '10px', md: '12px', lg: '14px' },
        paddingBlock: { base: '12px', md: '16px', lg: '20px', '2xl': '24px' },
        paddingInline: { base: '28px', md: '36px', lg: '44px', '2xl': '52px' },
      },
    },
  },
  // The `text` and `icon` variants are sizeless — neutralize the default size.
  compoundVariants: [
    {
      variant: 'link',
      css: { paddingBlock: '0', paddingInline: '0', gap: '0' },
    },
    {
      variant: 'icon',
      css: { padding: '0', gap: '0' },
    },
  ],
  defaultVariants: { variant: 'primary', size: 'md' },
})
