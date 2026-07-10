import { sva } from 'styled-system/css'

/**
 * Privacy page — co-located slot recipe.
 *
 * The legible long-form privacy/cookies article on the dark ground. The
 * `article` styles its Portable-Text descendants (a/ul/li) via element
 * selectors. The shared PageHero owns the header.
 */
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
