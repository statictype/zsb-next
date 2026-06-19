import { defineConfig } from '@pandacss/dev'
import designSystemPreset from './src/design-system/preset'

export default defineConfig({
  // The element reset lives in globals.css (`@layer base`).
  preflight: false,
  presets: ['@pandacss/preset-base', designSystemPreset],
  include: ['./src/**/*.{ts,tsx}'],
  exclude: [],
  jsxFramework: 'react',
  jsxStyleProps: 'none',
  outdir: 'styled-system',
})
