module.exports = {
  root: true,
  env: {
    browser: true,
    es2020: true
  },
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'plugin:storybook/recommended'],
  parser: '@typescript-eslint/parser',
  rules: {
    // Place to specify ESLint rules. Can be used to overwrite rules specified from the extended configs
    '@typescript-eslint/no-explicit-any': 'off',
    'react/prop-types': 'off',
    'react/react-in-jsx-scope': "off"
  }
};
