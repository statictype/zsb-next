import nextConfig from 'eslint-config-next'
import nextTypescript from 'eslint-config-next/typescript'
import reactCompiler from 'eslint-plugin-react-compiler'

const config = [
  ...nextConfig,
  ...nextTypescript,
  {
    plugins: {
      'react-compiler': reactCompiler,
    },
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      'react-compiler/react-compiler': 'error',
      'no-console': ['warn', { allow: ['error'] }],
      '@typescript-eslint/no-unnecessary-condition': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      'react/no-array-index-key': 'error',
      'jsx-a11y/no-static-element-interactions': 'error',
      'react/no-danger': 'error',
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['*.module.css'],
              message: 'CSS Modules are retired — use Panda CSS. See ADR 0017.',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['src/types/**/*.ts'],
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector: 'TSNullKeyword',
          message:
            'Domain types must not mirror Sanity nullability. Resolve absence in the mapper (see ABSENCE-HANDLING.md).',
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

export default config
