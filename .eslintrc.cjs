/* ESLint configuration for TypeScript + Playwright */
module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'playwright'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:playwright/recommended',
    'prettier',
  ],
  env: {
    node: true,
    es2021: true,
  },
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  overrides: [
    {
      files: ['tests/**/*.ts'],
      rules: {
        // Playwright plugin already applied via extends
      },
    },
  ],
  rules: {
    // Keep console statements for test diagnostics
    'no-console': 'off',
    // Allow silent catch blocks used to tolerate flaky overlays/consent
    'no-empty': ['error', { allowEmptyCatch: true }],
    // Let TS handle unused vars but ignore underscore-prefixed
    '@typescript-eslint/no-unused-vars': [
      'warn',
      { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
    ],
  },
};
