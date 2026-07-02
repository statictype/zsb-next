import { definePattern } from '@pandacss/dev'

export const editorialSplit = definePattern({
  description: 'Editorial two-column relationship shared by Manifesto and ThemeArtists',
  transform(props) {
    return {
      display: 'flex',
      flexDirection: 'column',
      ...props,
      lg: {
        display: 'grid',
        gridTemplateColumns: '0.8fr 1.2fr',
        ...props.lg,
      },
      xl: {
        gridTemplateColumns: '1fr 1fr',
        ...props.xl,
      },
    }
  },
})
