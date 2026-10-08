import { fileURLToPath } from 'node:url'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

const emptyModule = fileURLToPath(new URL('./test/empty-module.ts', import.meta.url))

export default defineConfig({
  plugins: [react()],
  resolve: {
    tsconfigPaths: true,
    alias: {
      'server-only': emptyModule,
      'client-only': emptyModule,
    },
  },
  test: {
    // src/sanity/env.ts throws on missing vars.
    env: {
      NEXT_PUBLIC_SANITY_PROJECT_ID: 'test',
      NEXT_PUBLIC_SANITY_DATASET: 'test',
      NEXT_PUBLIC_SANITY_API_VERSION: '2024-01-01',
      SANITY_API_READ_TOKEN: 'test-token',
    },
    projects: [
      {
        extends: true,
        test: {
          name: 'unit',
          environment: 'node',
          include: ['src/**/*.test.ts'],
        },
      },
      {
        extends: true,
        test: {
          name: 'component',
          environment: 'jsdom',
          include: ['src/**/*.test.tsx'],
          setupFiles: ['./vitest.setup.ts'],
        },
      },
    ],
  },
})
