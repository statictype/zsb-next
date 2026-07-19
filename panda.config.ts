import { defineConfig } from '@pandacss/dev'
import designSystemPreset from '@/design-system/preset'

export default defineConfig({
  // The element reset lives in globals.css (`@layer base`).
  preflight: false,
  presets: ['@pandacss/preset-base', designSystemPreset],
  include: ['./src/**/*.{ts,tsx}'],
  jsxFramework: 'react',
  jsxStyleProps: 'all',
  strictTokens: true,
  strictPropertyValues: true,
  outdir: 'styled-system',
  validation: 'error',
})
