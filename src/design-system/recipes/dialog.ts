import { defineSlotRecipe } from '@/design-system/define-recipe'

export const dialog = defineSlotRecipe({
  className: 'dialog',
  jsx: ['Dialog'],
  description: 'Modal shell with panel and fullscreen spatial presentations',
  slots: ['root', 'content', 'title'],
  base: {
    root: {
      position: 'fixed',
      inset: 0,
      width: '100%',
      height: '100%',
      maxWidth: 'none',
      maxHeight: 'none',
      margin: '0',
      padding: '0',
      border: '0',
      background: 'transparent',
      textStyle: 'body',
      color: 'body',
      '&[open]': {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      },
      _backdrop: { background: 'surface.scrim' },
    },
    content: {
      position: 'relative',
      width: '100%',
      minWidth: 0,
    },
    title: { layerStyle: 'srOnly' },
  },
  variants: {
    presentation: {
      panel: {
        root: { padding: 'lg', overflowY: 'auto' },
        content: {
          maxWidth: 'narrowColumn',
          maxHeight: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: 'black',
          border: 'hairline',
          boxShadow: 'modal',
          overflow: 'hidden',
          md: { flexDirection: 'row', maxWidth: 'dialogPanelWide' },
        },
      },
      fullscreen: {
        root: { _backdrop: { background: 'transparent' } },
        content: { width: '100vw', height: '100dvh', overflow: 'hidden' },
      },
    },
  },
  defaultVariants: { presentation: 'panel' },
})
