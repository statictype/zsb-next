import { defineRecipe } from '@pandacss/dev'

/**
 * The label roll — the resting label leaves upward while its duplicate arrives
 * from below, clipped by a mask snug to the line box. Same gesture as the nav
 * links, so an action and a destination answer a pointer the same way.
 */
const roll = {
  '& [data-btn-mask]': {
    display: 'block',
    overflow: 'hidden',
    // Carries the size variant's gap down to the label and its duplicate; `gap`
    // does not inherit on its own.
    gap: 'inherit',
  },
  '& [data-btn-label]': {
    display: 'inline-flex',
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
  // Pressed is a state, not a destination: nothing to preview, so it holds still.
  '&[aria-pressed=true] [data-btn-label]': { transform: 'none' },
} as const

/** Selected reads the same on every control: the chartreuse fill (nav, badges). */
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
    // A press moves the plate, on every variant.
    _active: { transform: 'translateY(1px)' },
  },
  variants: {
    variant: {
      /** The one loud action on a view: a 2px magenta edge that comes alive. */
      primary: {
        ...labelType,
        ...roll,
        background: 'transparent',
        color: 'heading',
        border: 'primary',
        '& [data-btn-copy]': { ...roll['& [data-btn-copy]'], color: 'action' },
        // The gradient ring — the same attention device the cards use — sits on
        // the border box at the border's own width, and the resting edge fades
        // out underneath it: the edge starts travelling, it does not thicken.
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
      /** The card's own language: a hairline box whose border takes the accent. */
      secondary: {
        ...labelType,
        ...roll,
        ...selected,
        background: 'transparent',
        color: 'heading',
        border: 'hairline',
        '& [data-btn-copy]': { ...roll['& [data-btn-copy]'], color: 'action' },
        _hover: { borderColor: 'action' },
      },
      /** Chrome-less control for in-place work — reset, dismiss, toggle. */
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
      /** Square hit target, no chrome — lightbox and menu controls. */
      icon: {
        background: 'transparent',
        color: 'heading',
        width: 'hitTarget',
        height: 'hitTarget',
        _hover: { color: 'action' },
      },
      /** Inline text inside running copy. */
      link: {
        display: 'inline',
        background: 'transparent',
        color: 'heading',
        textDecorationColor: 'action',
        textUnderlineOffset: '4px',
        _hover: { color: 'action', textDecoration: 'underline' },
      },
      /** No chrome at all — a pressable surface that carries its own look. */
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
  // The chrome-less variants are sizeless: they inherit the type around them.
  compoundVariants: [
    { variant: 'link', css: { padding: '0', gap: '0', fontSize: 'inherit' } },
    { variant: 'plain', css: { padding: '0', gap: '0', fontSize: 'inherit' } },
    { variant: 'icon', css: { padding: '0', gap: '0' } },
  ],
  defaultVariants: { variant: 'primary', size: 'md' },
})
