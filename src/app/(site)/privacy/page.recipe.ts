import { sva } from 'styled-system/css'

export const privacyPage = sva({
  slots: ['article', 'settingsRow'],
  base: {
    article: {
      maxWidth: 'measure',
      '& a': {
        textDecoration: 'underline',
        textUnderlineOffset: '3px',
        textDecorationColor: 'action',
        _hover: { color: 'action' },
      },
      '& ul': {
        listStyle: 'none',
        padding: '0',
      },
      '& ol': { paddingInlineStart: 'lg' },
      '& li': { paddingLeft: 'md', borderLeft: '[2px solid token(colors.divider)]' },
    },
    settingsRow: {
      padding: 'md',
      border: 'hairline',
      display: 'inline-flex',
    },
  },
})
