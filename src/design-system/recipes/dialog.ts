import { defineSlotRecipe } from '@pandacss/dev'

export const dialog = defineSlotRecipe({
  className: 'dialog',
  jsx: ['Dialog'],
  description: 'Modal shell with panel and fullscreen spatial presentations',
  slots: ['trigger', 'backdrop', 'positioner', 'content', 'title', 'description', 'closeTrigger'],
  base: {
    backdrop: {
      position: 'fixed',
      inset: 0,
      background: 'surface.scrim',
    },
    positioner: {
      position: 'fixed',
      inset: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    content: {
      position: 'relative',
      width: '100%',
      minWidth: 0,
      _focusVisible: {
        outline: 'focus',
        outlineOffset: 'dialogInset',
      },
    },
    title: { layerStyle: 'srOnly' },
  },
  variants: {
    presentation: {
      panel: {
        backdrop: { zIndex: 'overlay' },
        positioner: { zIndex: 'modal', padding: 'lg', overflowY: 'auto' },
        content: {
          maxWidth: 'dialogPanel',
          maxHeight: 'full',
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
        backdrop: { zIndex: 'overlay', background: 'transparent' },
        positioner: { zIndex: 'modal' },
        content: { width: '100vw', height: '100dvh', overflow: 'hidden' },
      },
    },
  },
  defaultVariants: { presentation: 'panel' },
})
