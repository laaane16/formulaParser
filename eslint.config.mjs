// @ts-check
import eslint from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';

// This is just an example default config for ESLint.
// You should change it to your needs following the documentation.
export default tseslint.config(
  {
    ignores: ['**/build/**', '**/tmp/**', '**/coverage/**'],
  },
  eslint.configs.recommended,
  {
    extends: [...tseslint.configs.recommended],

    files: ['**/*.ts', '**/*.mts'],

    plugins: {
      '@typescript-eslint': tseslint.plugin,
    },

    rules: {
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/explicit-function-return-type': 'warn',
    },

    languageOptions: {
      parser: tseslint.parser,
      ecmaVersion: 2020,
      sourceType: 'module',

      globals: {
        ...globals.node,
      },

      parserOptions: {
        project: './tsconfig.json',
      },
    },
  },
  {
    files: ['__tests__/**'],

    plugins: {},

    rules: {
      'prettier/prettier': [
        'warn',
        {
          endOfLine: 'auto',
        },
      ],
    },

    settings: {
      vitest: {
        typecheck: true,
      },
    },

    languageOptions: {
      globals: {},
    },
  },
);
