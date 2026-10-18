import { sva } from 'styled-system/css'

export const hero = sva({
  slots: [
    'fold',
    'hero',
    'inner',
    'intro',
    'mast',
    'facts',
    'fact',
    'body',
    'plate',
    'image',
    'thumb',
    'marquee',
    'marqueeItem',
    'srOnly',
  ],
  base: {
    fold: {
      display: 'flex',
      flexDirection: 'column',
      height: '80svh',
      minHeight: 'fit-content',
      _portraitPhone: { height: 'auto' },
    },
    hero: {
      layerStyle: 'pageHero',
      paddingInline: 'gutter',
      position: 'relative',
      flex: '1',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    },
    inner: {
      position: 'relative',
      zIndex: '1',
      flex: '1',
      width: '100%',
      maxWidth: 'maxWidth',
      marginInline: 'auto',
      display: 'flex',
      flexDirection: 'column',
      gap: '2xl',
    },

    intro: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'lg',
    },
    mast: { margin: '0', animationStyle: 'enter' },
    facts: {
      display: 'flex',
      flexWrap: 'wrap',
      columnGap: 'md',
      rowGap: 'sm',
      margin: '0',
      padding: '0',
      listStyle: 'none',
      animationStyle: 'enter',
      animationDelay: 'stagger',
    },
    fact: {
      display: 'flex',
      alignItems: 'center',
      gap: 'xs',
    },
    body: {
      margin: '0',
      maxWidth: '50ch',
      animationStyle: 'enter',
      animationDelay: 'stagger',
    },

    plate: {
      position: 'absolute',
      inset: '0',
      zIndex: '0',
      overflow: 'hidden',
      background: 'gray.900',
      _portraitPhone: {
        position: 'relative',
        inset: 'auto',
        aspectRatio: '1 / 1',
        marginBottom: 'xl',
      },
    },
    image: {
      objectFit: 'cover',
      _portraitPhone: { display: 'none' },
    },
    thumb: {
      objectFit: 'cover',
      display: 'none',
      _portraitPhone: { display: 'block' },
    },

    marquee: {
      display: 'flex',
      paddingBlock: 'xs',
      background: 'white',
      animationStyle: 'enter',
      animationDelay: 'stagger',
    },
    marqueeItem: {
      display: 'flex',
      alignItems: 'center',
      gap: 'md',
      color: 'black',
      whiteSpace: 'nowrap',
      _after: {
        content: '""',
        flexShrink: '0',
        width: '8px',
        height: '8px',
        borderRadius: 'circle',
        background: 'action',
      },
    },
    srOnly: { layerStyle: 'srOnly' },
  },
  variants: {
    ink: {
      black: {
        inner: {
          color: 'black',
          _portraitPhone: { color: 'white' },
        },
      },
      white: { inner: { color: 'white' } },
    },
    align: {
      top: { image: { objectPosition: 'right top' } },
      center: { image: { objectPosition: 'right center' } },
      bottom: { image: { objectPosition: 'right bottom' } },
    },
  },
  defaultVariants: { ink: 'white', align: 'center' },
})
