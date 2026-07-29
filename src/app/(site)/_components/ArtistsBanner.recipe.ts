import { sva } from 'styled-system/css'

const engaged = {
  _before: { opacity: '1' },
  '& [data-part=accent]': { transform: 'scaleX(1)' },
  '& [data-part=action]': { borderColor: 'action' },
  '& [data-part=arrow]': { color: 'action', transform: 'translate(4px, -4px)' },
} as const

export const artistsBanner = sva({
  slots: ['root', 'inner', 'body', 'subtext', 'action', 'arrow', 'accent'],
  base: {
    root: {
      position: 'relative',
      display: 'block',
      width: 'full',
      background: 'surface',
      borderTop: 'hairline',
      textDecoration: 'none',
      overflow: 'hidden',
      paddingBlock: 'lg',
      paddingInline: 'gutter',
      scrollMarginTop: '[token(sizes.nav)]',
      _before: {
        content: '""',
        position: 'absolute',
        inset: '0',
        background:
          '[linear-gradient(135deg, color-mix(in oklch, token(colors.pink) 8%, transparent) 0%, transparent 50%, color-mix(in oklch, token(colors.chartreuse) 5%, transparent) 100%)]',
        opacity: '0',
        transition: 'interactive',
      },
      _hover: { ...engaged },
      // The global focus ring sits 4px outside the box; on a full-bleed band
      // that puts its left and right edges past the viewport.
      _focusVisible: { ...engaged, outlineOffset: 'dialogInset' },
      _active: { '& [data-part=action]': { transform: 'translateY(1px)' } },
    },
    inner: {
      position: 'relative',
      zIndex: '1',
      width: 'full',
      maxWidth: 'maxWidth',
      marginInline: 'auto',
      display: 'grid',
      gap: 'md',
      lg: {
        gridTemplateColumns: '[1.4fr 1fr]',
        columnGap: 'xl',
        alignItems: 'end',
      },
    },
    body: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      gap: 'md',
    },
    subtext: {
      maxWidth: 'measure',
    },
    action: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 'sm',
      paddingBlock: { base: '[12px]', md: '[14px]' },
      paddingInline: { base: '[24px]', md: '[28px]' },
      border: 'hairline',
      fontFamily: 'body',
      fontSize: 'sm',
      fontWeight: 'medium',
      lineHeight: '1.3',
      letterSpacing: 'label',
      textTransform: 'uppercase',
      whiteSpace: 'nowrap',
      color: 'heading',
      transition: 'interactive',
    },
    arrow: {
      display: 'flex',
      flexShrink: '0',
      transition: 'interactive',
    },
    accent: {
      position: 'absolute',
      bottom: '0',
      left: '0',
      width: 'full',
      height: 'brushStroke',
      background: '[linear-gradient(90deg, token(colors.action) 0%, token(colors.highlight) 100%)]',
      transformOrigin: 'left',
      transform: 'scaleX(0)',
      transition: 'develop',
    },
  },
})
