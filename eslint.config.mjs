import nextConfig from 'eslint-config-next'
import nextTypescript from 'eslint-config-next/typescript'
import reactCompiler from 'eslint-plugin-react-compiler'

export default [
  ...nextConfig,
  ...nextTypescript,
  {
    plugins: {
      'react-compiler': reactCompiler,
    },
    rules: {
      // Rules of React — flags code that would disable React Compiler on a file
      'react-compiler/react-compiler': 'error',

      // Parity with the Biome rules we used to run
      'no-console': 'warn',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      'react/no-array-index-key': 'error',
      'jsx-a11y/no-static-element-interactions': 'error',
      'react/no-danger': 'error',

      // CSS Modules are fully retired — styling is Panda only (ADR 0017). Block
      // any new `*.module.css` import so the migration can't silently regress.
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['*.module.css'],
              message: 'CSS Modules are retired — use Panda CSS (css()/sva/recipes). See ADR 0017.',
            },
          ],
        },
      ],
    },
  },
  {
    ignores: [
      '.next/**',
      'out/**',
      'build/**',
      'next-env.d.ts',
      'sanity.types.ts',
      'schema.json',
      'node_modules/**',
      'styled-system/**',
    ],
  },
]
