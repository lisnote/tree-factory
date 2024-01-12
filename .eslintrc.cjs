const OFF = 'off';
const WARN = 'warn';
const ERROR = 'error';
module.exports = {
  env: { browser: true, node: true },
  plugins: ['@typescript-eslint'],
  extends: [
    'plugin:@typescript-eslint/eslint-recommended',
    'eslint:recommended',
    'prettier',
  ],
  parserOptions: { ecmaVersion: 2021 },
  parser: '@typescript-eslint/parser',
  root: true,
  rules: {
    '@typescript-eslint/no-explicit-any': OFF,
    '@typescript-eslint/no-inferrable-types': OFF,
    '@typescript-eslint/no-unused-vars': [
      WARN,
      { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
    ],
    'spaced-comment': [ERROR, 'always', { markers: ['/', '!'] }],
    camelcase: [ERROR, { properties: 'always' }],
  },
  overrides: [
    {
      files: ['*.html'],
      rules: {
        'vue/comment-directive': OFF,
      },
    },
  ],
};
