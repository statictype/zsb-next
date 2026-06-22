import { sva } from 'styled-system/css'

/**
 * Partners page — co-located slot recipe.
 *
 * Intro prose + full-width event image on dark, a "why sculpture" block on
 * light (eyebrow + title + image, then a 4-pillar grid), and a centered partner
 * CTA. Shared hero header → `PageHero`; the why-eyebrow → `<Eyebrow>`. Sections
 * that combined `shared.section` with a ground fold the padding straight in
 * (`layerStyle` carries only the ground; `section` was just padding). `border-
 * light`/`border-dark` → borderLight/borderDark hairlines.
 */
export const partnersPage = sva({
  slots: [
    'inner',
    'eventBody',
    'eventImage',
    'eventImageImg',
    'whySculptureTop',
    'whySculptureImage',
    'whySculptureImg',
    'whyGrid',
    'whyPillar',
    'whyPillarHead',
    'whyPillarNum',
    'whyPillarTitle',
    'whyPillarBody',
    'partnerCta',
    'partnerCtaInner',
    'partnerCtaBadge',
    'partnerCtaHeading',
    'partnerCtaAccent',
    'partnerCtaBody',
  ],
  base: {
    inner: { layerStyle: 'sectionInner' },

    eventBody: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'md',
      maxWidth: '60ch',
      marginBottom: '2xl',
      '& p': {
        fontFamily: 'body',
        fontSize: 'base',
        lineHeight: { base: 'body', md: 'loose' },
        color: 'body',
      },
    },
    eventImage: {
      position: 'relative',
      overflow: 'hidden',
      aspectRatio: '16 / 9',
      border: 'hairline',
      margin: '0',
    },
    eventImageImg: {
      objectFit: 'cover',
      background: 'gray.900',
      filter: 'grayscale(100%) contrast(1.05)',
    },

    whySculptureTop: {
      display: 'grid',
      gridTemplateColumns: '1fr',
      gap: '2xl',
      marginBottom: '3xl',
      lg: { gridTemplateColumns: '1fr 1fr', gap: '3xl', alignItems: 'end' },
    },
    whySculptureImage: {
      position: 'relative',
      overflow: 'hidden',
      aspectRatio: '16 / 10',
      border: 'hairline',
    },
    whySculptureImg: { objectFit: 'cover', background: 'gray.200', filter: 'grayscale(100%)' },

    whyGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr',
      borderTop: 'hairline',
      md: { gridTemplateColumns: '1fr 1fr' },
    },
    whyPillar: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'md',
      paddingBlock: 'xl',
      borderBottom: 'hairline',
      md: {
        padding: 'xl',
        '&:nth-child(odd)': {
          paddingLeft: '0',
          borderRight: 'hairline',
        },
        '&:nth-child(even)': { paddingRight: '0' },
      },
    },
    whyPillarHead: { display: 'flex', alignItems: 'baseline', gap: 'md' },
    whyPillarNum: {
      fontFamily: 'display',
      fontSize: 'md',
      color: 'muted',
      letterSpacing: 'tight',
    },
    whyPillarTitle: {
      fontFamily: 'display',
      fontSize: { base: 'lg', xl: 'xl' },
      textTransform: 'uppercase',
      lineHeight: 'tight',
      color: 'heading',
      letterSpacing: 'tight',
      margin: '0',
    },
    whyPillarBody: {
      fontFamily: 'body',
      fontSize: 'base',
      lineHeight: { base: 'body', md: 'loose' },
      color: 'body',
      maxWidth: '50ch',
    },

    // Dark ground + rhythm from `section({ ground: 'dark' })` in the component;
    // `partnerCtaInner` is the rail.
    partnerCta: {
      borderTop: 'hairline',
    },
    partnerCtaInner: {
      maxWidth: 'maxWidth',
      paddingInline: 'gutter',
      marginInline: 'auto',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
    },
    partnerCtaBadge: { marginBottom: '54px' },
    partnerCtaHeading: {
      fontFamily: 'display',
      fontSize: 'clamp(48px, 8vw, 106px)',
      color: 'white',
      lineHeight: 'display',
      marginBottom: '24px',
    },
    partnerCtaAccent: { color: 'action' },
    partnerCtaBody: {
      fontSize: 'base',
      lineHeight: 'body',
      fontWeight: 'light',
      color: 'body',
      maxWidth: '460px',
      marginBottom: '46px',
    },
  },
})
