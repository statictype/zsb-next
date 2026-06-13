// Panda CSS runs through PostCSS (Turbopack-supported in Next 16). CSS Modules
// continue to be handled by Next's own pipeline alongside this. See ZSB-70.
export default {
  plugins: {
    '@pandacss/dev/postcss': {},
  },
}
