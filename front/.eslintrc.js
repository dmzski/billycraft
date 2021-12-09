module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'plugin:react/recommended',
    'airbnb',
    'prettier',
    'plugin:@typescript-eslint/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 13,
    sourceType: 'module',
  },
  plugins: ['react', '@typescript-eslint'],
  rules: {
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: ['**/setupTests.ts', '**/*.test.tsx', '**/*.spec.tsx'],
      },
    ],
    'import/prefer-default-export': 'off',
    semi: 'off',
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        ts: 'never',
        tsx: 'never',
      },
    ],
    'react/require-default-props': ['off', { extensions: ['.tsx'] }],
    'react/jsx-filename-extension': ['off', { extensions: ['.tsx'] }],
    'react/function-component-definition': [2, { namedComponents: 'arrow-function' }],
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': 'error',
  },
  settings: {
    'import/resolver': {
      typescript: {},
    },
  },
  globals: {
    React: true,
    JSX: true,
  },
}
