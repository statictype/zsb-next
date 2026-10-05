import { definePattern, definePreset } from '@pandacss/dev'
import { navigationLabel } from '@/design-system/patterns/typography'
import { recipes, slotRecipes } from '@/design-system/recipes'
import {
  animationStyles,
  breakpoints,
  conditions,
  keyframes,
  layerStyles,
  semanticTokens,
  textStyles,
  tokens,
} from '@/design-system/tokens'

export const designSystemPreset = definePreset({
  name: 'zsb-design-system',
  conditions: { extend: conditions },
  utilities: {
    extend: {
      transition: {
        values: ['interactive', 'develop', 'none'],
        transform(value: string, { token }) {
          if (value === 'none') return { transition: 'none' }
          if (value !== 'interactive' && value !== 'develop') return {}
          return {
            transitionProperty:
              value === 'interactive'
                ? 'color, background-color, border-color, outline-color, text-decoration-color, fill, stroke, opacity, transform'
                : 'opacity, transform, translate, scale, filter, clip-path',
            transitionDuration: token(`durations.${value === 'interactive' ? 'fast' : 'normal'}`),
            transitionTimingFunction: token(
              `easings.${value === 'interactive' ? 'feedback' : 'motion'}`,
            ),
          }
        },
      },
      pressable: {
        values: ['fill', 'inline', 'dim', 'none'],
        transform(value: string, { token }) {
          const press =
            value === 'fill'
              ? { background: token('colors.divider') }
              : value === 'inline'
                ? { color: token('colors.highlight') }
                : value === 'dim'
                  ? { opacity: '0.85' }
                  : null
          if (press === null) return {}
          return {
            '&:active:not(:disabled, [aria-disabled=true], [aria-pressed=true])': {
              ...press,
              transitionDuration: '0ms',
            },
          }
        },
      },
    },
  },
  patterns: {
    extend: {
      stack: { defaultValues: { gap: 'md' } },
      hstack: { defaultValues: { gap: 'sm' } },
      wrap: { defaultValues: { gap: 'sm', align: 'center' } },
      grid: {
        defaultValues: (props) => ({
          gap: props.columnGap || props.rowGap ? undefined : 'xl',
        }),
      },
      container: {
        defaultValues: { maxWidth: 'maxWidth', px: 'gutter', position: 'static' },
      },
      navigationLabel,
      divider: definePattern({
        properties: {
          orientation: { type: 'enum', value: ['horizontal', 'vertical'] },
        },
        defaultValues: { orientation: 'horizontal' },
        transform(props, { map }) {
          const { orientation, ...rest } = props
          return {
            width: map(orientation, (v) => (v === 'vertical' ? undefined : '100%')),
            height: map(orientation, (v) => (v === 'horizontal' ? undefined : '100%')),
            borderBottom: map(orientation, (v) => (v === 'horizontal' ? 'hairline' : undefined)),
            borderRight: map(orientation, (v) => (v === 'vertical' ? 'hairline' : undefined)),
            ...rest,
          }
        },
      }),
      text: definePattern({
        jsxName: 'Text',
        jsxElement: 'span',
        properties: {
          variant: {
            type: 'enum',
            value: Object.keys(textStyles).filter((name) => name !== 'editionTheme'),
          },
        },
        defaultValues: { variant: 'body' },
        blocklist: [
          'fontSize',
          'fontFamily',
          'fontWeight',
          'letterSpacing',
          'lineHeight',
          'textTransform',
          'textStyle',
        ],
        transform({ variant, ...rest }) {
          const ink = ['lead', 'body', 'caption'].includes(variant)
            ? 'body'
            : variant === 'label'
              ? 'muted'
              : 'heading'
          return { textStyle: variant, color: ink, ...rest }
        },
      }),
    },
  },
  theme: {
    extend: {
      breakpoints,
      keyframes,
      tokens,
      semanticTokens,
      animationStyles,
      textStyles,
      layerStyles,
      recipes,
      slotRecipes,
    },
  },
  globalCss: {
    body: { textStyle: 'body', color: 'body', background: 'surface' },
    'html:has(dialog:modal)': { overflow: 'hidden' },
    ':focus-visible': { outline: 'focus', outlineOffset: 'token(spacing.focusInset)' },
    'a, button, [role=button], summary, label': { WebkitTapHighlightColor: 'transparent' },
    ':disabled, [aria-disabled=true], [data-disabled]': { opacity: 0.5, cursor: 'not-allowed' },
    '@media (prefers-reduced-motion: reduce)': {
      '*, *::before, *::after': {
        animationDuration: '0.01ms!',
        animationIterationCount: '1!',
        animationDelay: '0ms!',
        transitionDuration: '0.01ms!',
      },
    },
  },
})

export default designSystemPreset
