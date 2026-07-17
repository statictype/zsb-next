import { defineRecipe } from '@pandacss/dev'

const colorShift = { _hover: { color: 'action' } } as const
const subtleHover = { _hover: { color: 'heading', borderColor: 'heading' } } as const

export const button = defineRecipe({
  jsx: ['Button'],
  className: 'btn',
  description: 'The one action primitive — primary | secondary | link | icon (ADR 0019)',
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    border: 'none',
    transition: 'interactive',
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
      link: {
        display: 'inline',
        bg: 'transparent',
        color: 'muted',
        ...colorShift,
        _hover: { ...colorShift._hover, textDecoration: 'underline' },
      },
      icon: {
        width: 'hitTarget',
        height: 'hitTarget',
        padding: '0',
        background: 'transparent',
        borderWidth: '0',
        color: 'heading',
        _hover: { color: 'action', transform: 'translateY(-2px)' },
      },
    },
    size: {
      sm: {
        gap: '5px',
        paddingBlock: { base: '6px', md: '8px' },
        paddingInline: { base: '16px', md: '20px' },
      },
      md: {
        gap: { base: '8px', md: '10px' },
        paddingBlock: { base: '10px', md: '12px', lg: '14px', '2xl': '16px' },
        paddingInline: { base: '24px', md: '28px', lg: '32px', '2xl': '36px' },
      },
      lg: {
        gap: { base: '10px', md: '12px', lg: '14px' },
        paddingBlock: { base: '12px', md: '16px', lg: '20px', '2xl': '24px' },
        paddingInline: { base: '28px', md: '36px', lg: '44px', '2xl': '52px' },
      },
      touch: {
        width: 'touch',
        height: 'touch',
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
