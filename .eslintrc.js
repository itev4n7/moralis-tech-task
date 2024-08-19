module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'plugin:playwright/recommended'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint'],
  ignorePatterns: ['test-html-report/**', 'test-results/**', '.eslintrc.js'],
  rules: {
    eqeqeq: 'warn',
    strict: 'off',
    quotes: ['error', 'single'],
    indent: ['error', 2],
    'space-before-blocks': ['error', 'always'],
    'no-trailing-spaces': ['error'],
    '@typescript-eslint/no-non-null-asserted-optional-chain': 'warn',
    'playwright/missing-playwright-await': 'error',
    'playwright/no-focused-test': 'error',
    'playwright/no-wait-for-timeout': 'off',
    'playwright/no-skipped-test': 'off',
    'playwright/expect-expect': 'off',
  },
};
