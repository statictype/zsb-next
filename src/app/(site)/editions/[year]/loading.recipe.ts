import { sva } from 'styled-system/css'

/**
 * Edition loading skeleton — co-located slot recipe.
 *
 * The Suspense fallback for an edition page: pulsing "bone" placeholders laid
 * out roughly like the real hero / manifesto / artists / venues / carousel
 * sections. `bone` is the shared `skeleton` layer style (surface + shimmer
 * sweep, same mechanism as the image skeleton); the size slots are combined
 * onto it via `cx`. The carousel height inlines the former `--carousel-height` stepped
 * var (this was its last consumer).
 */
export const editionLoading = sva({
  slots: [
    'page',
    'bone',
    'hero',
    'heroEyebrow',
    'heroYear',
    'heroTheme',
    'section',
    'sectionTitle',
    'manifesto',
    'manifestoLine',
    'artistGrid',
    'artistCard',
    'venueRow',
    'venueItem',
    'carousel',
  ],
  base: {
    page: { minHeight: '[100vh]', background: 'black' },

    bone: { layerStyle: 'skeleton' },

    hero: {
      height: 'svh',
      minHeight: '[600px]',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 'lg',
      paddingInline: 'gutter',
    },
    heroEyebrow: { width: '[200px]', height: '[28px]' },
    heroYear: { width: '[320px]', height: '[100px]', md: { width: '[440px]', height: '[140px]' } },
    heroTheme: { width: '[240px]', height: '[48px]', md: { width: '[340px]', height: '[60px]' } },

    section: {
      maxWidth: 'maxWidth',
      marginInline: 'auto',
      paddingBlock: 'sectionY',
      paddingInline: 'gutter',
    },
    sectionTitle: { width: '[180px]', height: '[28px]', marginBottom: 'xl' },

    manifesto: { display: 'flex', flexDirection: 'column', gap: 'md' },
    manifestoLine: {
      height: '[16px]',
      '&:nth-child(1)': { width: '[90%]' },
      '&:nth-child(2)': { width: 'full' },
      '&:nth-child(3)': { width: '[75%]' },
      '&:nth-child(4)': { width: '[85%]' },
      '&:nth-child(5)': { width: '[60%]' },
    },

    artistGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: 'md',
      md: { gridTemplateColumns: 'repeat(3, 1fr)' },
      lg: { gridTemplateColumns: 'repeat(4, 1fr)' },
    },
    artistCard: { aspectRatio: '3 / 4' },

    venueRow: { display: 'flex', flexDirection: 'column', gap: 'md' },
    venueItem: { height: '[80px]', borderBottom: 'hairline' },

    carousel: {
      height: {
        base: '[50vh]',
        md: '[60vh]',
        lg: '[70vh]',
        xl: '[72vh]',
        '2xl': '[75vh]',
        '4xl': '[80vh]',
      },
    },
  },
})
