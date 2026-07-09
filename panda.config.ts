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
  // Every style value is a token (or a deliberate, [bracketed] exception).
  strictTokens: true,
  outdir: 'styled-system',
})
