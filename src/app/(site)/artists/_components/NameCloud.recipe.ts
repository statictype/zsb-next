import { sva } from 'styled-system/css'

export const nameCloud = sva({
  slots: ['list', 'item', 'name', 'years'],
  base: {
    list: {
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'baseline',
      listStyleType: 'none',
      columnGap: 'md',
      rowGap: 'lg',
      md: {
        justifyContent: 'center',
        maxWidth: '[900px]',
        marginInline: 'auto',
        paddingInline: 'xl',
      },
    },
    item: {
      position: 'relative',
      lineHeight: '[1]',
      '@media (hover: hover)': {
        _hover: { zIndex: '1' },
      },
      '@media (hover: none)': {
        '[data-name-cloud-tap] &': { cursor: 'pointer' },
      },
    },
    name: {
      transition: 'interactive',
      '@media (hover: hover)': {
        'li:hover &': { color: 'heading' },
      },
      '@media (hover: none)': {
        '[data-name-cloud-tap] li:active &': { color: 'heading' },
      },
    },
    years: {
      '@media (hover: none)': {
        marginInlineStart: 'xs',
        fontSize: '[max(11px, 0.8em)]',
        lineHeight: '[1.3]',
        color: 'muted',
        '[data-name-cloud-tap] &': { layerStyle: 'srOnly' },
      },
      '@media (hover: hover)': {
        position: 'absolute',
        insetBlockStart: '[calc(100% + token(spacing.sm) + token(spacing.xs))]',
        insetInlineStart: '[50%]',
        translate: '[-50% 0]',
        width: '[max-content]',
        paddingBlock: 'xs',
        paddingInline: 'sm',
        whiteSpace: 'nowrap',
        background: 'surface',
        border: 'hairline',
        fontSize: 'sm',
        color: 'body',
        opacity: '0',
        pointerEvents: 'none',
        transition: 'interactive',
        _before: {
          content: '""',
          position: 'absolute',
          insetBlockEnd: '[100%]',
          insetInlineStart: '[50%]',
          translate: '[-50% 0]',
          width: '0',
          height: '0',
          borderInlineWidth: '[5px]',
          borderInlineStyle: 'solid',
          borderInlineColor: '[transparent]',
          borderBottomWidth: '[9px]',
          borderBottomStyle: 'solid',
          borderBottomColor: 'divider',
        },
        _after: {
          content: '""',
          position: 'absolute',
          insetBlockEnd: '[calc(100% - 2px)]',
          insetInlineStart: '[50%]',
          translate: '[-50% 0]',
          width: '0',
          height: '0',
          borderInlineWidth: '[5px]',
          borderInlineStyle: 'solid',
          borderInlineColor: '[transparent]',
          borderBottomWidth: '[9px]',
          borderBottomStyle: 'solid',
          borderBottomColor: 'surface',
        },
        'li:hover &': { opacity: '1' },
      },
    },
  },
  variants: {
    size: {
      1: {
        item: { fontSize: 'sm' },
        name: { fontWeight: 'light', letterSpacing: '[0.04em]', color: 'muted' },
      },
      2: {
        item: { fontSize: '[clamp(14px, 13.6px + 0.125vw, 16px)]' },
        name: { fontWeight: 'regular', letterSpacing: '[0.02em]', color: 'muted' },
      },
      3: {
        item: { fontSize: '[clamp(16px, 15.6px + 0.125vw, 18px)]' },
        name: { fontWeight: 'medium', letterSpacing: '[0em]', color: 'body' },
      },
      4: {
        item: { fontSize: '[clamp(18px, 17.6px + 0.125vw, 20px)]' },
        name: { fontWeight: 'semibold', letterSpacing: '[-0.01em]', color: 'body' },
      },
      5: {
        item: { fontSize: '[clamp(20px, 19.4px + 0.1875vw, 23px)]' },
        name: { fontWeight: 'bold', letterSpacing: 'tight', color: 'body' },
      },
    },
  },
  defaultVariants: { size: 1 },
})
