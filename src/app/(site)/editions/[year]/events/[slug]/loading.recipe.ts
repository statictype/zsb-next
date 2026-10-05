import { sva } from 'styled-system/css'

export const eventLoading = sva({
  slots: [
    'page',
    'bone',
    'crumb',
    'detail',
    'layout',
    'poster',
    'column',
    'name',
    'meta',
    'line',
    'actions',
    'action',
    'rail',
    'step',
  ],
  base: {
    page: {
      minHeight: 'svh',
      paddingTop: 'calc(token(sizes.nav) + token(spacing.md))',
      paddingBottom: 'xl',
      maxWidth: 'maxWidth',
      marginInline: 'auto',
      paddingInline: 'gutter',
    },
    bone: { layerStyle: 'skeleton' },

    crumb: { width: '160px', height: '32px', marginBottom: 'md' },

    layout: {
      display: 'grid',
      lg: { gridTemplateColumns: 'minmax(0, 38%) minmax(0, 1fr)' },
    },
    poster: {
      aspectRatio: '3 / 4',
      maxHeight: '52dvh',
      borderBlockEnd: 'hairline',
      lg: { borderBlockEnd: 'none' },
    },
    column: {
      display: 'grid',
      alignContent: 'start',
      gap: 'md',
      padding: 'lg',
      xl: { padding: 'xl' },
    },
    name: { width: '80%', height: '36px' },
    meta: { width: '220px', height: '20px' },
    line: {
      height: '14px',
      '&:nth-of-type(1)': { width: '100%' },
      '&:nth-of-type(2)': { width: '88%' },
      '&:nth-of-type(3)': { width: '64%' },
    },

    actions: {
      borderTop: 'hairline',
      paddingInline: 'lg',
      paddingBlock: 'md',
      xl: { paddingInline: 'xl' },
    },
    action: { width: '200px', height: '32px' },

    rail: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
      gap: 'md',
      marginTop: 'lg',
    },
    step: {
      width: '60%',
      height: '40px',
      '&:last-child': { justifySelf: 'end' },
    },
  },
  variants: {
    shell: {
      page: {
        detail: { border: 'hairline' },
        layout: { lg: { alignItems: 'start', minHeight: 'min(70vh, 720px)' } },
        poster: { lg: { maxHeight: 'calc(100svh - token(sizes.nav))' } },
        column: { lg: { alignSelf: 'stretch', borderInlineStart: 'hairline' } },
      },
      modal: {
        layout: { lg: { minHeight: '0' } },
        poster: { lg: { aspectRatio: 'auto', maxHeight: 'none', borderInlineEnd: 'hairline' } },
        column: { lg: { alignContent: 'center' } },
      },
    },
  },
  defaultVariants: { shell: 'page' },
})
