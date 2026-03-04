import js from '@eslint/js';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';

export default [
  { ignores: ['dist', 'build', 'node_modules', '.firebase'] },
  {
    files: ['src/**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    settings: { react: { version: '18.3' } },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      ...reactHooks.configs.recommended.rules,
      'no-unused-vars': 'off',
      'react/jsx-no-target-blank': 'off',
      'react/prop-types': 'off',
      'react/no-unknown-property': 'off',
      'react-refresh/only-export-components': 'warn',
      'react-hooks/exhaustive-deps': 'warn',
      'no-undef': 'warn',
      'no-empty': 'warn',
      'react/no-unescaped-entities': 'warn',
      'react/display-name': 'off',
      'no-constant-condition': 'warn',
      'no-fallthrough': 'warn',
    },
  },
  {
    files: ['vite.config.js', 'eslint.config.js'],
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
  },
];
