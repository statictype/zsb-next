import { defineSlotRecipe } from '@pandacss/dev'

export const carousel = defineSlotRecipe({
  className: 'carousel',
  jsx: ['Carousel'],
  description: 'Ark-backed stage and rail carousel contract',
  slots: ['root', 'itemGroup', 'item', 'control', 'trigger', 'indicatorGroup', 'indicator'],
  base: {
    root: { position: 'relative', width: '100%', minWidth: 0 },
    itemGroup: {
      scrollbarWidth: 'none',
      scrollBehavior: 'smooth',
      '&::-webkit-scrollbar': { display: 'none' },
      '&[data-dragging]': { cursor: 'grabbing' },
      _motionReduce: { scrollBehavior: 'auto' },
    },
    item: { minWidth: 0 },
    control: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 'md',
      '& [data-carousel-arrows]': { display: 'flex', alignItems: 'center', gap: 'sm' },
    },
    // Shared by prev/next/autoplay — all three are the same 44px transparent
    // hit target with the same hover/focus treatment.
    trigger: {
      width: 'hitTarget',
      height: 'hitTarget',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: 0,
      background: 'transparent',
      color: 'heading',
      cursor: 'pointer',
      _hover: { color: 'action' },
      _disabled: { opacity: 0.5, cursor: 'not-allowed' },
    },
    indicatorGroup: { display: 'flex', alignItems: 'center', gap: '10px' },
    indicator: {
      width: '14px',
      height: '2px',
      padding: 0,
      border: 0,
      background: 'muted',
      cursor: 'pointer',
      '&[data-current]': { width: '28px', background: 'highlight' },
    },
  },
  variants: {
    mode: {
      stage: {
        root: { display: 'flex', flexDirection: 'column', gap: 'md' },
        control: { maxWidth: 'maxWidth', marginInline: 'auto' },
        itemGroup: {
          width: '100%',
          aspectRatio: { base: '4 / 5', md: '16 / 9' },
          background: 'black',
        },
        item: {
          width: '100%',
          height: '100%',
          '& > [data-carousel-slide-content]': { width: '100%', height: '100%' },
        },
      },
      rail: {
        itemGroup: { cursor: 'grab', touchAction: 'pan-x' },
        control: { paddingInline: 'gutter' },
        item: { '& > [data-carousel-slide-content]': { height: '100%' } },
      },
    },
  },
  defaultVariants: { mode: 'rail' },
})
