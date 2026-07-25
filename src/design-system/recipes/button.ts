import { defineRecipe } from '@pandacss/dev'

const roll = {
  '& [data-btn-mask]': {
    display: 'flex',
    overflow: 'hidden',
    gap: 'inherit',
  },
  '& [data-btn-label]': {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 'inherit',
    position: 'relative',
    transition: 'develop',
  },
  '& [data-btn-copy]': {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 'inherit',
    position: 'absolute',
    top: 'token(sizes.rollOffset)',
    left: '0',
    right: '0',
  },
  '&:is(:hover, :focus-visible):not(:disabled, [aria-disabled=true]) [data-btn-label]': {
    transform: 'translateY(calc(token(sizes.rollOffset) * -1))',
  },
  '&[aria-pressed=true] [data-btn-label]': { transform: 'none' },
} as const

const selected = {
  '&[aria-pressed=true]': {
    background: 'highlight',
    borderColor: 'highlight',
    color: 'black',
    boxShadow: 'litEdge',
  },
} as const

const labelType = {
  fontFamily: 'body',
  fontWeight: 'medium',
  lineHeight: '1.3',
  letterSpacing: 'label',
  textTransform: 'uppercase',
  whiteSpace: 'nowrap',
} as const

export const button = defineRecipe({
  jsx: ['Button'],
  className: 'btn',
  description: 'The one action primitive — primary | secondary | quiet | icon | link | plain',
  base: {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    isolation: 'isolate',
    appearance: 'none',
    borderRadius: 'none',
    border: 'none',
    cursor: 'pointer',
    transition: 'interactive',
    _active: { transform: 'translateY(1px)' },
  },
  variants: {
    variant: {
      primary: {
        ...labelType,
        ...roll,
        background: 'transparent',
        color: 'heading',
        border: 'primary',
        '& [data-btn-copy]': { ...roll['& [data-btn-copy]'], color: 'action' },
        // Sits on the border box at the border's own width, and the resting
        // edge fades out under it, so the edge travels instead of thickening.
        _before: {
          content: '""',
          layerStyle: 'gradientBorder',
          inset: '[calc(token(borderWidths.hairline) * -1)]',
          padding: '[token(borderWidths.hairline)]',
        },
        _hover: {
          borderColor: 'transparent',
          '&::before': { opacity: 1, animationStyle: 'gradientBorder' },
        },
      },
      secondary: {
        ...labelType,
        ...roll,
        ...selected,
        background: 'transparent',
        color: 'heading',
        border: 'hairline',
        _hover: { borderColor: 'action' },
      },
      quiet: {
        ...labelType,
        ...roll,
        ...selected,
        background: 'transparent',
        color: 'body',
        border: 'hairline',
        borderColor: 'transparent',
        '& [data-btn-copy]': { ...roll['& [data-btn-copy]'], color: 'action' },
        _hover: { color: 'heading' },
      },
      icon: {
        background: 'transparent',
        color: 'heading',
        width: 'hitTarget',
        height: 'hitTarget',
        _hover: { color: 'action' },
      },
      link: {
        display: 'inline',
        background: 'transparent',
        color: 'heading',
        textDecorationColor: 'action',
        textUnderlineOffset: '4px',
        _hover: { color: 'action', textDecoration: 'underline' },
      },
      plain: {
        display: 'block',
        background: 'transparent',
        color: 'current',
        textAlign: 'left',
      },
    },
    size: {
      sm: {
        gap: '6px',
        minHeight: '32px',
        paddingBlock: 'sm',
        paddingInline: 'md',
        fontSize: 'xs',
      },
      md: {
        gap: '8px',
        paddingBlock: { base: '12px', md: '14px' },
        paddingInline: { base: '24px', md: '28px' },
        fontSize: 'sm',
      },
      lg: {
        gap: '10px',
        paddingBlock: { base: '16px', md: '20px' },
        paddingInline: { base: '32px', md: '40px' },
        fontSize: 'base',
      },
      touch: {
        width: 'touch',
        height: 'touch',
      },
    },
  },
  // The chrome-less variants are sizeless — neutralize the default size.
  compoundVariants: [
    { variant: 'link', css: { padding: '0', gap: '0', fontSize: 'inherit' } },
    { variant: 'plain', css: { padding: '0', gap: '0', fontSize: 'inherit' } },
    { variant: 'icon', css: { padding: '0', gap: '0' } },
  ],
  defaultVariants: { variant: 'primary', size: 'md' },
})
