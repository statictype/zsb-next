import { sva } from 'styled-system/css'

export const credits = sva({
  slots: ['ledger', 'row', 'accent', 'value', 'detail', 'logo', 'run'],
  base: {
    ledger: {
      width: 'full',
      borderTop: 'hairline',
    },
    row: {
      display: 'grid',
      gridTemplateColumns: 'minmax(0, 1fr)',
      rowGap: 'xs',
      paddingBlock: 'md',
      borderBottom: 'hairline',
      md: {
        gridTemplateColumns: '[minmax(140px, 16%) minmax(0, 1fr)]',
        columnGap: 'lg',
        alignItems: 'baseline',
      },
    },
    accent: { color: 'action' },
    value: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      minWidth: '0',
    },
    detail: {
      whiteSpace: 'pre-line',
    },
    logo: {
      height: '[44px]',
      width: 'auto',
      objectFit: 'contain',
      objectPosition: 'left',
      filter: '[token(assets.grayscaleFull)]',
      transition: 'develop',
      marginTop: 'md',
      md: { height: '[64px]' },
      _hover: { filter: '[none]' },
    },
    run: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignItems: 'baseline',
      columnGap: '0',
      rowGap: 'xs',
      maxWidth: 'measure',
      '& span': {
        display: 'inline-flex',
        alignItems: 'center',
        whiteSpace: 'nowrap',
      },
      '& span:not(:last-child)::after': {
        content: '""',
        flex: 'none',
        width: '[3px]',
        height: '[3px]',
        marginInline: 'sm',
        borderRadius: 'circle',
        background: 'action',
      },
    },
  },
})
