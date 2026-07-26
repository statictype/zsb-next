import { sva } from 'styled-system/css'

export const eventLoading = sva({
  slots: ['page', 'bone', 'crumb', 'detail', 'poster', 'column', 'name', 'meta', 'line', 'actions'],
  base: {
    page: {
      minHeight: 'svh',
      paddingTop: '[calc(token(sizes.nav) + token(spacing.md))]',
      paddingBottom: 'xl',
      maxWidth: 'maxWidth',
      marginInline: 'auto',
      paddingInline: 'gutter',
    },
    bone: { layerStyle: 'skeleton' },

    crumb: { width: '[180px]', height: '[20px]', marginBottom: 'md' },

    detail: {
      display: 'grid',
      border: 'hairline',
      md: {
        gridTemplateColumns: '[minmax(0, 42%) minmax(0, 1fr)]',
        minHeight: '[min(70vh, 720px)]',
      },
    },
    poster: {
      aspectRatio: '3 / 4',
      maxHeight: '[52dvh]',
      md: { aspectRatio: 'auto', maxHeight: '[none]' },
    },
    column: {
      display: 'grid',
      alignContent: 'center',
      gap: 'md',
      padding: 'lg',
      xl: { padding: 'xl' },
    },
    name: { width: '[80%]', height: '[44px]' },
    meta: { width: '[220px]', height: '[20px]' },
    line: {
      height: '[14px]',
      '&:nth-of-type(1)': { width: 'full' },
      '&:nth-of-type(2)': { width: '[88%]' },
      '&:nth-of-type(3)': { width: '[64%]' },
    },
    actions: { height: '[32px]', width: '[240px]', marginTop: 'md' },
  },
})
