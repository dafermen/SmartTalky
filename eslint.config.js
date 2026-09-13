import eslint from '@eslint/js'
import prettier from 'eslint-config-prettier'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import globals from 'globals'
import tseslint from 'typescript-eslint'

const webFiles = ['apps/web/**/*.{ts,tsx}']

export default tseslint.config(
  {
    ignores: [
      '**/dist/**',
      '**/coverage/**',
      '**/node_modules/**',
      'android/**',
      'ios/App/App/public/**',
      'storage/**',
    ],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
    },
  },
  {
    files: [
      '*.js',
      '*.mjs',
      'scripts/**/*.{js,mjs}',
      'apps/api/**/*.ts',
      'packages/**/*.ts',
    ],
    languageOptions: {
      globals: globals.node,
    },
  },
  {
    ...reactHooks.configs.flat['recommended-latest'],
    files: webFiles,
    languageOptions: {
      globals: globals.browser,
    },
  },
  {
    ...reactRefresh.configs.vite,
    files: webFiles,
  },
  prettier,
)
