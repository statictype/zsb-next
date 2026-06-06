import { fileURLToPath } from 'node:url'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vitest/config'

const emptyModule = fileURLToPath(new URL('./test/empty-module.ts', import.meta.url))

export default defineConfig({
  // tsconfigPaths resolves the `@/*` alias; react enables JSX for component
  // tests. We deliberately don't run babel-plugin-react-compiler here — it's a
  // build-time optimization, and tests exercise behaviour, not compiler output.
  plugins: [tsconfigPaths(), react()],
  resolve: {
    alias: {
      // Let `server-only` / `client-only` modules import under the test runner.
      'server-only': emptyModule,
      'client-only': emptyModule,
    },
  },
  test: {
    // Dummy Sanity vars so importing the data layer (→ src/sanity/env.ts, which
    // throws on missing vars) doesn't blow up. urlFor just builds CDN URLs from
    // these; tests assert shape, never hit the network.
    env: {
      NEXT_PUBLIC_SANITY_PROJECT_ID: 'test',
      NEXT_PUBLIC_SANITY_DATASET: 'test',
      NEXT_PUBLIC_SANITY_API_VERSION: '2024-01-01',
      SANITY_API_READ_TOKEN: 'test-token',
    },
    // Two projects, split by file extension:
    //   *.test.ts  → pure logic, node environment
    //   *.test.tsx → component behaviour, jsdom + RTL
    // Playwright specs live in e2e/ (*.spec.ts) and are never matched here.
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
